  // src/Routes.jsx
  import { Routes, Route, Navigate } from 'react-router-dom';
  import Login from './components/Auth/Login';
  import Register from './components/Auth/Register';
  import HomePage from './components/Home/HomePage';
  import SearchResults from './components/SearchResults/SearchResults';
  import UploadPage from './components/Upload/UploadPage';
  import DocumentViewer from './components/SearchResults/DocumentViewer';
  import { useAuth } from './contexts/AuthContext';



  const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return !isAuthenticated ? children : <Navigate to="/home" />;
  };

  const AppRoutes = () => {
    return (
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* Protected Routes */}
        <Route path="/home" element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        } />
        <Route path="/results" element={
          <PrivateRoute>
            <SearchResults />
          </PrivateRoute>
        } />
        <Route path="/upload" element={
          <PrivateRoute>
            <UploadPage />
          </PrivateRoute>
        } />

        {/* Move this route before the default */}
        <Route path="/view/:id" element={
          <PrivateRoute>
            <DocumentViewer />
          </PrivateRoute>
        } />

        {/* Default Routes */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    );

  };

  export default AppRoutes;