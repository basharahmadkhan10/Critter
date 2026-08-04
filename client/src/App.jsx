import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import RequireAuth from './components/RequireAuth';
import PersistLogin from './components/PersistLogin';
import BackgroundDots from './components/BackgroundDots';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <BackgroundDots />
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Protected Routes */}
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={
                <div style={{ textAlign: 'center', padding: '100px' }}>
                  <h1>Welcome to your Dashboard!</h1>
                  <p>You are authenticated.</p>
                </div>
              } />
            </Route>
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
