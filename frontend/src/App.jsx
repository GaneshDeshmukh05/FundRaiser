import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreateFundraiser from './pages/CreateFundraiser';
import FundraiserPage from './pages/FundraiserPage';
import Dashboard from './pages/Dashboard';
import ThankYou from './pages/ThankYou';

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateFundraiser />} />
        <Route path="/f/:id" element={<FundraiserPage />} />
        <Route path="/dashboard/:id" element={<Dashboard />} />
        <Route path="/thankyou" element={<ThankYou />} />
      </Routes>
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'dark:bg-slate-800 dark:text-white',
          duration: 3000,
        }}
      />
    </div>
  );
}
