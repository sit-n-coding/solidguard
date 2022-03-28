import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import { createTheme, ThemeProvider, styled } from "@mui/material/styles"
import Colors from "../styles/colors.js"
import Link from 'next/link'
import Grid from "@mui/material/Grid"

const theme = createTheme({
    typography: {
        fontFamily: "Assistant",
    },

    palette: {
        primary: {
            main: Colors["5"],
            darker: '#053e85',
        }
    },
})

const NavLink = (props) => {
    return (

        <Button href={props.link} color="inherit" style={{ marginRight: "10px" }} component="a">
            <Typography>{props.text}</Typography>
        </Button>
    )
}

const Navbar = (props) => (
    <div >
        <ThemeProvider theme={theme}>
            <AppBar position="static">
                <Toolbar >
                    <Grid container
                        xs={6}
                        justifyContent="flex-start"
                        color={Colors.textDark}>
                        <Link
                            href={"/"}
                            passHref>
                            <Typography variant="h5" component="div" style={{ marginRight: "30px" }}>
                                SolidGuard
                            </Typography>
                        </Link>
                        <NavLink text="About Us" link="/about" />
                        <NavLink text="Security Check" link="securitycheck" />
                        <NavLink text="Attack Library" link="/attacklibrary" />
                        <NavLink text="Get started" link="/register" />
                    </Grid>

                    <Button href="/signin" color="inherit" sx={{ marginLeft: "auto" }}>
                        <Typography style={{ textDecoration: "underline" }}>Sign In</Typography>
                    </Button>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    </div>
)

export default Navbar
