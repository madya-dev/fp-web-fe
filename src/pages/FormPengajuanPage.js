import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Avatar, Radio, FormControlLabel, Grid, FormHelperText } from '@mui/material';
import axios from 'axios';

function NewFormPage() {
  const navigate = useNavigate();
  const [type, setType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate the required fields
    if (!type || !startDate || !endDate) {
      setError('Please fill in all the required fields');
      return;
    }

    setError('');

    try {
      const formData = new FormData();
      formData.append('type', type);
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
      formData.append('file', file);

      // Send a POST request to the API endpoint
      const response = await axios.post('http://localhost:8080/cis/new', {
        type:type,
        start_date: startDate,
        end_date: endDate,
        file: file
      }, {
        headers: {
            Authorization:`${JSON.parse(localStorage.getItem('HRtoken')).value}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Assuming the response contains a success flag or data upon successful submission
      if (response.status === 201) {
        // Redirect to a success page or display a success message
        console.log(response)
        navigate('/manajemen-cis');
      } else {
        setError('Failed to submit the form. Please try again later.');
        console.log(response)
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      console.log(error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: '2rem' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 120, height: 120 }}>
          <img src="https://placekitten.com/200/200" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Avatar> */}
        <Typography variant="h5" align="center" gutterBottom>
         Form Pengajuan
        </Typography>
      </Box>
      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Radio checked={type === 1} onChange={() => setType(1)} />}
              label="Cuti"
            />
            <FormControlLabel
              control={<Radio checked={type === 2} onChange={() => setType(2)} />}
              label="Ijin"
            />
            <FormControlLabel
              control={<Radio checked={type === 3} onChange={() => setType(3)} />}
              label="Sakit"
            />
          </Grid>
          <Grid item xs={12}>
          <FormHelperText id="startDate">Waktu Mulai</FormHelperText>
            <TextField
              id="startDate"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
          <FormHelperText id="startDate">Waktu Selesai</FormHelperText>
            <TextField
              id="endDate"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <input
              type="file"
              accept=".pdf, .png, .jpg, .jpeg"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: 'none' }}
              id="file-input"
            />
            <label htmlFor="file-input">
              <Button variant="contained" component="span" fullWidth>
                Upload File Pendukung
              </Button>
            </label>
            <label>{}</label>
          </Grid>
        </Grid>

        {error && (
          <Typography variant="body1" color="error" sx={{ marginTop: '1rem' }}>
            {error}
          </Typography>
        )}
        <Button type="submit" variant="contained" size="large" fullWidth sx={{ marginTop: '1rem' }}>
          Kirim
        </Button>
      </form>
    </Container>
  );
}

export default NewFormPage;
