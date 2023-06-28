import React, { useEffect, useState } from 'react'
import Dashboard from './Dashboard'
import { Button, Card, CardContent, FormHelperText, Grid, MenuItem, TextField, Typography } from '@mui/material'
import axios from 'axios';

export default function SlipGajiPage() {
  const [employees, setEmployees] = useState([])
  const [data, setData] = useState({
    username:'',
    bonus:0,
    start_periode:'',
    end_periode:''

  })
  useEffect(() => {
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
  const generateSlip = async () => {
    try {
      const response = await axios.post('http://localhost:8080/slip/generate',{...data, bonus:parseFloat(data?.bonus)},{
        headers:{
            Authorization:`${JSON.parse(localStorage.getItem('HRtoken')).value}`
        }
      });
      if(response.data.code === 200){
        window.open(response.data.data.slip, "_blank")
      }
    } catch (error) {
      console.error('Error Generate:', error);
    }
  };
  return (
    <Dashboard>
      <Card>
        <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
            Generate Slip Gaji
          </Typography>
          <FormHelperText id="name">Karyawan</FormHelperText>
          <TextField
          margin="normal"
          fullWidth
          select
          value={data.username}
          onChange={(e)=> setData({...data, username:e.target.value})}
          variant="outlined"
          sx={{ minWidth: 200 }}
        >
          {
            employees?.map((e, i)=>{
              return <MenuItem value={e.username} key={`key${i}`}>{e.name}</MenuItem>
            })
          }
      </TextField>
        <FormHelperText id="bonus">Bonus</FormHelperText>
          <TextField
          type='number'
            value={data?.bonus}
            fullWidth
            margin="normal"
            onChange={(e)=> setData({...data, bonus:e.target.value})}
          />
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
        <FormHelperText id="startDate">Tanggal Awal</FormHelperText>
          <TextField
          type='date'
            value={data?.start_periode}
            fullWidth
            margin="normal"
            onChange={(e)=> setData({...data, start_periode:e.target.value})}
          />
          </Grid>
          <Grid item xs={6}>
        <FormHelperText id="startDate">Tanggal Akhir</FormHelperText>
          <TextField
          type='date'
            value={data?.end_periode}
            fullWidth
            margin="normal"
            onChange={(e)=> setData({...data, end_periode:e.target.value})}
          />
          </Grid>
          </Grid>
          <Button fullWidth variant='contained' onClick={generateSlip}>Generate</Button>
        </CardContent>
      </Card>
    </Dashboard>
  )
}
