import { createContext } from "react";
import {
  createMuiTheme,
  CssBaseline,
  responsiveFontSizes,
  ThemeProvider as MuiThemeProvider,
} from "@material-ui/core";

export const ThemeContext = createContext();

const ThemeProvider = (props) => {
  const muiTheme = createMuiTheme({});
  const theme = responsiveFontSizes(muiTheme);

  return (
    <ThemeContext.Provider value={{}}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {props.children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
