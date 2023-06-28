import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard';
import {
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  Grid,
  FormControlLabel,
  Radio,
  Stack,
  Modal,
  Box
} from '@mui/material';

function createData(name, code) {
  return { name, code };
}

const CISPage = () => {

  const data ={
   type:"",
   employee_id: 0,
   cis_status:1,
   start_date:"",
   end_date:"",
   file:""
  }
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const [lihatOpen, setLihatOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  // const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [cis, setCis] = useState(data);
  const [cisId, setCisId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:8080/cis/',{
        headers:{
            Authorization:`${JSON.parse(localStorage.getItem('HRtoken')).value}`
        }
      });
      console.log(response)
      setEmployees(response.data.data.cis_list === null ? [] : response.data.data.cis_list);
    } catch (error) {
      console.error('Error fetching cis:', error);
    }
  };

  const fetchEmployeeById = async (cisId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/cis/${cisId}`,{
            headers:{
                Authorization:`${JSON.parse(localStorage.getItem('HRtoken')).value}`
            }
        }
      );
      setCis(response.data.data.cis);
      console.log(response.data.data.cis)
    } catch (error) {
      console.error(`Error fetching CIS with ID ${cisId}:`, error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleLihatOpen = (row) => {
    setSelectedRow(row);
    setLihatOpen(true);
    fetchEmployeeById(row.id); // Fetch employee details
  };

  const handleLihatClose = () => {
    setLihatOpen(false);
    setSelectedRow(null);
    setCis(data);
  };

  const handleEditOpen = (row) => {
    setSelectedRow(row);
    setEditOpen(true);
    setCisId(row.id)
    fetchEmployeeById(row.id); // Fetch employee details
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedRow(null);
    setCis(data);
    setCisId(null)
  };
  // const handleAddOpen = () => {
  //   setAddOpen(true);
  // };

  // const handleAddClose = () => {
  //   setAddOpen(false);
  //   setEmployee(data);
  // };
  const handleDeleteOpen = (id) => {
    setSelectedRow(id);
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
    setSelectedRow(null);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(
        `http://localhost:8080/cis/${cisId}`,{
          cis_status:cis.status
        },{
            headers:{
                Authorization:`${JSON.parse(localStorage.getItem('HRtoken')).value}`
            }
        },
      );
      handleEditClose();
      fetchEmployees(); // Fetch updated data after successful update
    } catch (error) {
      console.error(`Error updating employee with ID ${cisId}:`, error);
    }
  };
  // const handleSaveAdd = async () => {
  //   try {
  //     await axios.post(
  //       `http://localhost:8080/account/create`,{...employee, age:parseInt(employee?.age), salary:parseFloat(employee?.salary)},{
  //           headers:{
  //               Authorization:`${JSON.parse(localStorage.getItem('HRtoken')).value}`
  //           }
  //       },
  //     );
  //     handleAddClose();
  //     fetchEmployees(); // Fetch updated data after successful update
  //   } catch (error) {
  //     console.error(`Error add employee  `, error);
  //   }
  // };
  const handleDelete = async (e) => {
    try {
      await axios.delete(
        `http://localhost:8080/cis/${e}`,{
            headers:{
                Authorization:`${JSON.parse(localStorage.getItem('HRtoken')).value}`
            }
        },
      );
      handleDeleteClose();
      fetchEmployees(); // Fetch updated data after successful update
    } catch (error) {
      console.error(`Error delete employee  `, error);
    }
  };

  const filteredRows = employees.filter((row) =>
    row.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const columns = [
    { id: 'no', label: 'No', minWidth: 50, align: 'center' },
    { id: 'nama', label: 'Nama', minWidth: 170 },
    { id: 'status', label: 'Status', minWidth: 170 },
    {
      id: 'aksi',
      label: 'Aksi',
      align: 'center',
      minWidth: 200,
    },
  ];

  const dateHandler = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth();
    const year = d.getFullYear();
    const hour = d.getHours();
    const minute = d.getMinutes();

    return `${day}/${month+1}/${year} Pukul ${hour}:${minute}`
  }
  return (
    <Dashboard>
      <Card>
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
          <Typography variant="h5" component="div" gutterBottom>
            Data CIS (Cuti, Izin, Sakit) Karyawan
          </Typography>
          {/* <Button
          variant="contained"
          size="small"
          onClick={() => handleAddOpen()}
          // style={{
          //   border: '1px solid primary',
          // }}
        >
          Tambah Karyawan
        </Button> */}
        </Stack>
          <TextField
            label="Search"
            value={searchValue}
            onChange={handleSearchChange}
            fullWidth
            margin="normal"
          />
          <TableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        minWidth: column.minWidth,
                        fontWeight: 'bold',
                        background: '#f5f5f5',
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.cis_id}>
                      <TableCell align="center" style={{ minWidth: columns[0].minWidth }}>
                        {index + 1}
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.status}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleLihatOpen(row)}
                          style={{
                            border: '1px solid',
                            backgroundColor: 'white',
                            marginRight: '5px',
                          }}
                        >
                          Lihat
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleEditOpen(row)}
                          style={{
                            border: '1px solid orange',
                            backgroundColor: 'white',
                            color:'orange',
                            marginRight: '5px',
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleDeleteOpen(row.id)}
                          style={{
                            border: '1px solid red',
                            backgroundColor: 'white',
                            color:'red'
                          }}
                        >
                          Hapus
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      {/* Lihat Pop-up */}
      <Dialog open={lihatOpen} onClose={handleLihatClose}>
        <DialogTitle>Lihat Data</DialogTitle>
        <DialogContent>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
                <FormHelperText id="name">Nama</FormHelperText>
                  <TextField
                    value={cis?.name}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />
                 <FormHelperText id="type">Jenis</FormHelperText>
                  <TextField
                    value={cis?.status === 3 ? "Sakit" : cis?.status === 2 ? "Izin" : "Cuti"}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />
                  <FormHelperText id="startDate">Waktu Mulai</FormHelperText>
                  <TextField
                    value={dateHandler(cis?.start_date)}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />

          </Grid>
          <Grid item xs={6}>
          <FormHelperText id="endDate">Waktu Selesai</FormHelperText>
                  <TextField
                    
                    value={dateHandler(cis?.end_date)}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />
          <FormHelperText id="status">Status</FormHelperText>
                  <TextField
                    value={cis?.status === 3 ? "Diterima" : cis?.status === 2 ? "Ditolak" : "Pending"}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />
          <FormHelperText id="file">File Pendukung</FormHelperText>
                  <Button href={cis?.file} target="_blank">Lihat File Pendukung</Button>
                  <FormHelperText id="type">Jenis</FormHelperText>
                    <Grid item xs={12}>
                    <FormControlLabel
                      control={<Radio checked={cis?.status === 1} InputProps={{readOnly:true}} />}
                      label="Cuti"
                    />
                    <FormControlLabel
                      control={<Radio checked={cis?.status === 2} InputProps={{readOnly:true}} />}
                      label="Izin"
                    />
                    <FormControlLabel
                      control={<Radio checked={cis?.status === 3} InputProps={{readOnly:true}} />}
                      label="Sakit"
                    />
                    </Grid>
          </Grid>

        </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLihatClose}>Close</Button>
        </DialogActions>
      </Dialog>
      
      {/* Add Pop-up */}
      {/* <Dialog open={addOpen} onClose={handleAddClose}>
        <DialogTitle>Tambah Data</DialogTitle>
        <DialogContent>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
          <FormHelperText id="username">Username</FormHelperText>
                  <TextField
                    value={employee?.username}
                    fullWidth
                    margin="normal"
                    onChange={(event) =>
                      setEmployee({ ...employee, username: event.target.value })
                    }
                  />
                <FormHelperText id="name">Nama</FormHelperText>
                  <TextField
                    value={employee?.name}
                    fullWidth
                    margin="normal"
                    onChange={(event) =>
                      setEmployee({ ...employee, name: event.target.value })
                    }
                  />
                <FormHelperText id="name">Email</FormHelperText>
                  <TextField
                  type='email'
                    value={employee?.email}
                    fullWidth
                    margin="normal"
                    onChange={(event) =>
                      setEmployee({ ...employee, email: event.target.value })
                    }
                  />
                  <FormHelperText id="age">Umur</FormHelperText>
                  <TextField
                  type='number'
                    value={employee?.age}
                    fullWidth
                    margin="normal"
                    onChange={(event) =>
                      setEmployee({ ...employee, age: event.target.value })
                    }
                  />
                  <FormHelperText id="salary">Gaji</FormHelperText>
                  <TextField
                    type='number'
                    value={employee?.salary}
                    fullWidth
                    margin="normal"
                    onChange={(event) =>
                      setEmployee({ ...employee, salary: event.target.value })
                    }
                  />
          </Grid>
          <Grid item xs={6}>

          <FormHelperText id="position">Posisi</FormHelperText>
                  <TextField
                    value={employee?.position}
                    fullWidth
                    margin="normal"
                    onChange={(event) =>
                      setEmployee({ ...employee, position: event.target.value })
                    }
                  />
                  <FormHelperText id="status">Status</FormHelperText>
                    <Grid item xs={12}>
                    <FormControlLabel
                      control={<Radio checked={employee?.status === 1} onChange={(e) => setEmployee({...employee, status:1})} />}
                      label="Full Time"
                    />
                    <FormControlLabel
                      control={<Radio checked={employee?.status === 2} onChange={() => setEmployee({...employee, status:2})} />}
                      label="Part Time"
                    />
                    <FormControlLabel
                      control={<Radio checked={employee?.status === 3} onChange={() => setEmployee({...employee, status:3})} />}
                      label="Freelance"
                    />
                    </Grid>
       
                    <FormHelperText id="role">Role</FormHelperText>
                    <Grid item xs={12}>
                    <FormControlLabel
                      control={<Radio checked={employee?.role === 0} onChange={(e) => setEmployee({...employee, role:0})} />}
                      label="Admin"
                    />
                    <FormControlLabel
                      control={<Radio checked={employee?.role === 1} onChange={() => setEmployee({...employee, role:1})} />}
                      label="User"
                    />
                </Grid>
          </Grid>

        </Grid>
       
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose}>Batal</Button>
          <Button onClick={handleSaveAdd} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog> */} 
      {/* Edit Pop-up */}
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Update Status</DialogTitle>
        <DialogContent>
                  <FormHelperText id="status">Status</FormHelperText>
                    <Grid item xs={12}>
                    <FormControlLabel
                      control={<Radio checked={cis?.status === 1} onChange={() => setCis({...cis, status:1})} />}
                      label="Pending"
                    />
                    <FormControlLabel
                      control={<Radio checked={cis?.status === 2} onChange={() => setCis({...cis, status:2})} />}
                      label="Rejected"
                    />
                    <FormControlLabel
                      control={<Radio checked={cis?.status === 3} onChange={() => setCis({...cis, status:3})} />}
                      label="Accepted"
                    />

        </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Batal</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete Pop-up */}
      <Dialog open={deleteOpen} onClose={handleDeleteClose}>
        <DialogTitle>Yakin untuk menghapus?</DialogTitle>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Batal</Button>
          <Button onClick={()=>handleDelete(selectedRow)} variant="contained" style={{backgroundColor:"red"}}>
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Dashboard>
  );
};

export default CISPage;
