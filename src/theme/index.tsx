import { responsiveFontSizes } from "@mui/material"
import { createTheme } from "@mui/material/styles"
import shadows from "./shadows"
import { light, dark } from "./palette"

const getTheme = (mode: any, themeToggler: any) =>
   responsiveFontSizes(
      createTheme({
         // @ts-ignore
         palette: mode === "light" ? light : dark,
         // @ts-ignore
         shadows: shadows(mode),
         typography: {
            fontFamily: '"Mulish", sans-serif',
            button: {
               textTransform: "none",
               fontWeight: "medium",
            },
         },
         zIndex: {
            appBar: 1200,
            drawer: 1300,
         },
         components: {
            MuiButton: {
               styleOverrides: {
                  root: {
                     fontWeight: 600,
                     borderRadius: 5,
                     paddingTop: 10,
                     paddingBottom: 10,
                  },
                  containedSecondary: mode === "light" ? { color: "white" } : {},
               },
            },
            MuiInputBase: {
               styleOverrides: {
                  root: {
                     borderRadius: 5,
                  },
               },
            },
            MuiOutlinedInput: {
               styleOverrides: {
                  root: {
                     borderRadius: 5,
                  },
                  input: {
                     borderRadius: 5,
                  },
               },
            },
            MuiCard: {
               styleOverrides: {
                  root: {
                     borderRadius: 8,
                  },
               },
            },
         },
         // @ts-ignore
         themeToggler,
      }),
   )

export default getTheme
