import { createTheme, ThemeProvider, styled } from "@mui/material/styles"
import Colors from "./colors.js"

const theme = createTheme({
    typography: {
        fontFamily: "Assistant",
    },

    palette: {
        primary: {
            main: Colors["1"],
            darker: '#053e85',
        }
    },
})

theme.typography.h4 = {
    fontSize: '1.2rem',
    '@media (min-width:600px)': {
        fontSize: '1.5rem',
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '2.4rem',
    },

};

export default theme;