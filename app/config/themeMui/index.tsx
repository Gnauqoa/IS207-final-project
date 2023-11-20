import { ThemeProvider, createTheme } from "@mui/material";
import { type ReactNode } from "react";
import breakpoints from "./breakpoints";

const themeOptions = {
  breakpoints,
};

const customTheme = createTheme(themeOptions);

function MUIThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeProvider theme={customTheme}>{children}</ThemeProvider>;
}

export default MUIThemeProvider;
