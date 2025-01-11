import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Building2, ClipboardList, Wrench, DollarSign } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Bases from './pages/Bases';
import Services from './pages/Services';
import Properties from './pages/Properties';
import Projects from './pages/Projects';
import Payments from './pages/Payments';
import Login from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './components/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100 flex">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <>
                  <Sidebar
                    items={[
                      { icon: ClipboardList, label: 'Dashboard', path: '/' },
                      { icon: Building2, label: 'Bases', path: '/bases' },
                      { icon: Wrench, label: 'Servicios', path: '/services' },
                      { icon: Building2, label: 'Propiedades', path: '/properties' },
                      { icon: DollarSign, label: 'Pagos', path: '/payments' },
                    ]}
                  />
                  <main className="flex-1 p-8">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/bases" element={<Bases />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/properties" element={<Properties />} />
                      <Route path="/projects/new" element={<Projects />} />
                      <Route path="/payments" element={<Payments />} />
                    </Routes>
                  </main>
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
