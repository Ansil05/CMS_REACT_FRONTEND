import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RoleProvider } from './context/RoleContext';
import AppRoutes from './routes';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoleProvider>
          <AppRoutes />
        </RoleProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
