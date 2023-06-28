import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import FormPengajuanPage from './pages/FormPengajuanPage';
import EmployeesPage from './pages/EmployeesPage';
import CISPage from './pages/CISPage';
import SlipGajiPage from './pages/SlipGajiPage';
import NotFoundPage from './pages/NotFoundPage';
import ProjectPage from './pages/ProjectPage';


function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/form" element={<FormPengajuanPage />} />
          <Route path="/manajemen-karyawan" element={<EmployeesPage />} />
          <Route path="/manajemen-cis" element={<CISPage />} />
          <Route path="/slip-gaji" element={<SlipGajiPage />} />
          <Route path="/manajemen-proyek" element={<ProjectPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </Router>
  );
}

export default App;
