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
  Checkbox,
} from '@mui/material';
import { CheckBox } from '@mui/icons-material';
export default function ProjectPage() {
    const data ={
      assign:[],
       name:"",
        client:"",
        budget:0,
        start_date:"",
        end_date:"",
        longtime:""
      }
      const [page, setPage] = useState(0);
      const [rowsPerPage, setRowsPerPage] = useState(10);
      const [searchValue, setSearchValue] = useState('');
      const [lihatOpen, setLihatOpen] = useState(false);
      const [editOpen, setEditOpen] = useState(false);
      const [addOpen, setAddOpen] = useState(false);
      const [deleteOpen, setDeleteOpen] = useState(false);
      const [selectedRow, setSelectedRow] = useState(null);
      const [projects, setProjects] = useState([]);
      const [employees, setEmployees] = useState([]);
      const [employeesProject, setEmployeesProject] = useState([]);
      const [project, setProject] = useState(data);
    
      useEffect(() => {
        fetchProjects();
        fetchEmployees();
      }, []);

      const fetchEmployees = async () => {
        try {
          const response = await axios.get('http://localhost:8080/employee/',{
            headers:{
                Authorization:`${JSON.parse(localStorage.getItem('HRtoken')).value}`
            }
          });
          console.log(response)
          setEmployees(response.data.data.employee_list);
        } catch (error) {
          console.error('Error fetching employees:', error);
        }
      };
    
      const fetchProjects = async () => {
        try {
          const response = await axios.get('http://localhost:8080/project/',{
            headers:{
                Authorization:`${JSON.parse(localStorage.getItem('HRtoken')).value}`
            }
          });
          console.log(response)
          setProjects(response.data.data.project_list !== null && response.data.data.project_list);
        } catch (error) {
          console.error('Error fetching projects:', error);
        }
      };
    
      const fetchProjectById = async (projectId) => {
        try {
          const response = await axios.get(
            `http://localhost:8080/project/${projectId}`,{
                headers:{
                    Authorization:`${JSON.parse(localStorage.getItem('HRtoken')).value}`
                }
            }
          );
          setEmployeesProject(response.data.data.project.assign)
          setProject(response.data.data.project);
          console.log(response.data.data.project)
        } catch (error) {
          console.error(`Error fetching Project with ID ${projectId}:`, error);
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
        fetchProjectById(row.id); // Fetch employee details
      };
    
      const handleLihatClose = () => {
        setLihatOpen(false);
        setSelectedRow(null);
        setProject(data);
      };
    
      const handleEditOpen = (row) => {
        setSelectedRow(row);
        setEditOpen(true);
        fetchProjectById(row.id); // Fetch employee details
      
      };
    
      const handleEditClose = () => {
        setEditOpen(false);
        setSelectedRow(null);
        setProject(data);
      };
      const handleAddOpen = () => {
        setAddOpen(true);
  
      };
    
      const handleAddClose = () => {
        setAddOpen(false);
        setProject(data);
        setEmployeesProject([])
      };
      const handleDeleteOpen = (id) => {
        setSelectedRow(id);
        setDeleteOpen(true);
      };
    
      const handleDeleteClose = () => {
        setDeleteOpen(false);
        setSelectedRow(null);
      };
    
      const handleSaveEdit = async () => {
        console.log(selectedRow)
        try {
          await axios.put(
            `http://localhost:8080/project/${selectedRow.id}`,{...project, budget:parseFloat(project?.budget), employees_id:employeesProject},{
                headers:{
                    Authorization:`${JSON.parse(localStorage.getItem('HRtoken')).value}`
                }
            },
          );
          handleEditClose();
          fetchProjects(); // Fetch updated data after successful update
        } catch (error) {
          console.error(`Error updating employee with ID ${selectedRow.project_id}:`, error);
        }
      };
      const handleSaveAdd = async () => {
        try {
          await axios.post(
            `http://localhost:8080/project/new`,{...project, budget:parseFloat(project?.budget), employees_id:employeesProject},{
                headers:{
                    Authorization:`${JSON.parse(localStorage.getItem('HRtoken')).value}`
                }
            },
          );
          handleAddClose();
          fetchProjects(); // Fetch updated data after successful update
        } catch (error) {
          console.error(`Error add projects  `, error);
        }
      };
      const handleDelete = async (e) => {
        try {
          await axios.delete(
            `http://localhost:8080/project/${e}`,{
                headers:{
                    Authorization:`${JSON.parse(localStorage.getItem('HRtoken')).value}`
                }
            },
          );
          handleDeleteClose();
          fetchProjects(); // Fetch updated data after successful update
        } catch (error) {
          console.error(`Error delete project  `, error);
        }
      };
    
      const filteredRows = projects?.filter((row) =>
        row.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    
      const columns = [
        { id: 'no', label: 'No', minWidth: 50, align: 'center' },
        { id: 'nama', label: 'Nama', minWidth: 170 },
        { id: 'client', label: 'Klien', minWidth: 170 },
        {
          id: 'aksi',
          label: 'Aksi',
          align: 'center',
          minWidth: 200,
        },
      ];

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
                Data Project
              </Typography>
              <Button
              variant="contained"
              size="small"
              onClick={() => handleAddOpen()}
              // style={{
              //   border: '1px solid primary',
              // }}
            >
              Tambah Karyawan
            </Button>
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
                    {filteredRows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => (
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.project_id}>
                          <TableCell align="center" style={{ minWidth: columns[0].minWidth }}>
                            {index + 1}
                          </TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.client}</TableCell>
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
                count={filteredRows?.length}
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
                    <FormHelperText id="name">Nama Project</FormHelperText>
                      <TextField
                        value={project?.name}
                        fullWidth
                        margin="normal"
                        InputProps={{ readOnly: true }}
                      />
                      <FormHelperText id="client">Klien</FormHelperText>
                      <TextField
                        value={project?.client}
                        fullWidth
                        margin="normal"
                        InputProps={{ readOnly: true }}
                      />
                      <FormHelperText id="budget">Budget</FormHelperText>
                      <TextField
                        
                        value={project?.budget}
                        fullWidth
                        margin="normal"
                        InputProps={{ readOnly: true }}
                      />
              </Grid>
              <Grid item xs={6}>
    
              <FormHelperText id="startDate">Tanggal Mulai</FormHelperText>
                      <TextField
                        value={project?.start_date}
                        fullWidth
                        margin="normal"
                        InputProps={{ readOnly: true }}
                      />
              <FormHelperText id="endDate">Tanggal Selesai</FormHelperText>
                      <TextField
                        value={project?.end_date}
                        fullWidth
                        margin="normal"
                        InputProps={{ readOnly: true }}
                      />
              <FormHelperText id="longtime">Lama Waktu</FormHelperText>
                      <TextField
                        value={project?.longtime + ' hari'}
                        fullWidth
                        margin="normal"
                        InputProps={{ readOnly: true }}
                      />
                   
              </Grid>
                              
            </Grid>
              <FormHelperText id="tim">Tim</FormHelperText>
              {
                employees.map((d,i)=>{
                  if(employeesProject.includes(d.employee_id)) return <Typography key={`ii${i}`}>- {d.name}</Typography>
                })
              }
            </DialogContent>
            <DialogActions>
              <Button onClick={handleLihatClose}>Close</Button>
            </DialogActions>
          </Dialog>
          
          {/* Add Pop-up */}
          <Dialog open={addOpen} onClose={handleAddClose}>
            <DialogTitle>Tambah Data</DialogTitle>
            <DialogContent>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={6}>
                    <FormHelperText id="name">Nama Project</FormHelperText>
                      <TextField
                        value={project?.name}
                        fullWidth
                        margin="normal"
                        onChange={(event) =>
                          setProject({ ...project, name: event.target.value })
                        }
                      />
                      <FormHelperText id="client">Klien</FormHelperText>
                      <TextField
                        value={project?.client}
                        fullWidth
                        margin="normal"
                        onChange={(event) =>
                          setProject({ ...project, client: event.target.value })
                        }
                      />
                      <FormHelperText id="budget">Budget</FormHelperText>
                      <TextField
                        
                        value={project?.budget}
                        fullWidth
                        margin="normal"
                        onChange={(event) =>
                          setProject({ ...project, budget: event.target.value })
                        }
                      />
              </Grid>
              <Grid item xs={6}>
    
              <FormHelperText id="startDate">Tanggal Mulai</FormHelperText>
                      <TextField
                        value={project?.start_date}
                        fullWidth
                        margin="normal"
                        type='date'
                        onChange={(event) =>
                          setProject({ ...project, start_date: event.target.value })
                        }
                      />
              <FormHelperText id="endDate">Tanggal Selesai</FormHelperText>
                      <TextField
                      type='date'
                        value={project?.end_date}
                        fullWidth
                        margin="normal"
                        onChange={(event) =>
                          setProject({ ...project, end_date: event.target.value })
                        }
                      />
                   
              </Grid>
                              
            </Grid>
              <FormHelperText id="tim">Tim</FormHelperText>
            {employees?.map((d,i)=>{
                return  <FormControlLabel control={<Checkbox onChange={(e)=>setEmployeesProject(e.target.checked ? [...employeesProject, d.employee_id] : employeesProject.filter((em)=> em !== d.employee_id))}/>} label={d.name} />
            })}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleAddClose}>Batal</Button>
              <Button onClick={handleSaveAdd} variant="contained" color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
          {/* Edit Pop-up */}
           <Dialog open={editOpen} onClose={handleEditClose}>
            <DialogTitle>Edit Data</DialogTitle>
            <DialogContent>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={6}>
                    <FormHelperText id="name">Nama Project</FormHelperText>
                      <TextField
                        value={project?.name}
                        fullWidth
                        margin="normal"
                        onChange={(event) =>
                          setProject({ ...project, name: event.target.value })
                        }
                      />
                      <FormHelperText id="client">Klien</FormHelperText>
                      <TextField
                        value={project?.client}
                        fullWidth
                        margin="normal"
                        onChange={(event) =>
                          setProject({ ...project, value: event.target.value })
                        }
                      />
                      <FormHelperText id="budget">Budget</FormHelperText>
                      <TextField
                        
                        value={project?.budget}
                        fullWidth
                        margin="normal"
                        onChange={(event) =>
                          setProject({ ...project, budget: event.target.value })
                        }
                      />
              </Grid>
              <Grid item xs={6}>
    
              <FormHelperText id="startDate">Tanggal Mulai</FormHelperText>
                      <TextField
                        value={project?.start_date}
                        fullWidth
                        margin="normal"
                        onChange={(event) =>
                          setProject({ ...project, start_date: event.target.value })
                        }
                      />
              <FormHelperText id="endDate">Tanggal Selesai</FormHelperText>
                      <TextField
                        value={project?.end_date}
                        fullWidth
                        margin="normal"
                        onChange={(event) =>
                          setProject({ ...project, end_date: event.target.value })
                        }
                      />
                   
              </Grid>
                              
            </Grid>
              <FormHelperText id="tim">Tim</FormHelperText>
            {employees?.map((d,i)=>{
                return  <FormControlLabel control={<Checkbox defaultChecked={employeesProject.includes(d.employee_id)} onChange={(e)=>setEmployeesProject(e.target.checked ? [...employeesProject, d.employee_id] : employeesProject.filter((em)=> em !== d.employee_id))}/>} label={d.name} />
            })}
           
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
}
