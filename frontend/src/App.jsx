
import { CssBaseline } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import Router from './routes/Router';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider as CustomThemeProvider } from './contexts/ThemeContext'; // Import custom ThemeProvider

function App() {
  const routing = useRoutes(Router);

  return (
    <CustomThemeProvider>
      <NotificationProvider>
        <CssBaseline />
        {routing}
      </NotificationProvider>
    </CustomThemeProvider>
  );
}

export default App;