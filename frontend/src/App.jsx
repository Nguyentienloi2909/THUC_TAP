
import { CssBaseline, ThemeProvider } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import Router from './routes/Router';
import { NotificationProvider } from './contexts/NotificationContext';

import { baselightTheme } from "./theme/DefaultColors";
// import { basedarkTheme } from "./theme/DefaultColors";
function App() {

  const routing = useRoutes(Router);
  const theme = baselightTheme;
  // const theme = basedarkTheme;

  return (
    <ThemeProvider theme={theme}>
      <NotificationProvider>
        <CssBaseline />
        {routing}
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;