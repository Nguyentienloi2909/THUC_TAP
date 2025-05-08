import { SearchProvider } from 'src/contexts/SearchContext';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import Router from './routes/Router';

import { baselightTheme } from "./theme/DefaultColors";
// import { basedarkTheme } from "./theme/DefaultColors";
function App() {

  const routing = useRoutes(Router);
  const theme = baselightTheme;
  // const theme = basedarkTheme;

  return (
    <SearchProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {routing}
      </ThemeProvider>
    </SearchProvider>
  );
}

export default App;