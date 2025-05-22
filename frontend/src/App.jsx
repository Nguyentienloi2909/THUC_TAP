
import { CssBaseline } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import Router from './routes/Router';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider as CustomThemeProvider } from './contexts/ThemeContext';
import { SignalRProvider } from './contexts/SignalRContext';
import { UserProvider } from './contexts/UserContext';

function App() {
  const routing = useRoutes(Router);

  return (
    <UserProvider>
      <CustomThemeProvider>
        <SignalRProvider>
          <NotificationProvider>
            <CssBaseline />
            {routing}
          </NotificationProvider>
        </SignalRProvider>
      </CustomThemeProvider>
    </UserProvider>
  );
}

export default App;