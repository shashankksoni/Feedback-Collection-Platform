import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister'; // <-- NEW IMPORT
import AdminDashboard from './pages/AdminDashboard';
import CreateForm from './pages/CreateForm';
import ViewResponses from './pages/ViewResponses';
import PublicForm from './pages/PublicForm';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root URL to admin login */}
        <Route path="/" element={<Navigate to="/admin/login" replace />} />

        {/* New registration page route */}
        <Route path="/admin/register" element={<AdminRegister />} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin/dashboard" element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        } />

        <Route path="/admin/create-form" element={
          <PrivateRoute>
            <CreateForm />
          </PrivateRoute>
        } />

        <Route path="/admin/responses/:formId" element={
          <PrivateRoute>
            <ViewResponses />
          </PrivateRoute>
        } />

        <Route path="/form/:publicId" element={<PublicForm />} />

        {/* Catch all unmatched routes */}
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
