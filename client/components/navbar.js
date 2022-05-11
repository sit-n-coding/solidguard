import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Link from "next/link"
import * as React from "react"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import Image from 'next/image'
import { createTheme, ThemeProvider, styled } from "@mui/material/styles"
import Colors from "../styles/colors.js"
import Grid from "@mui/material/Grid"
import SolidGuard from "../styles/navbarlogo.png"
import Avatar from '@mui/material/Avatar';
import avatar from '../styles/avatar.png'
import Typography from "@mui/material/Typography"
import { AuthContext } from '../components/authContext'

const theme = createTheme({
    typography: {
        fontFamily: "Assistant"
    },

    palette: {
        primary: {
            main: Colors["5"],
            darker: "#053e85"
        }
    }
})

const NavLink = (props) => {
    return (
        <Button href={props.link} color="inherit" style={{ marginRight: "14px", textTransform: 'none' }} component="a">
            <Typography>{props.text}</Typography>
        </Button>
    )
}

const Navbar = (props) => {
    const [authState, updateAuthState] = React.useContext(AuthContext);
    const userId = authState.userId;

    return (
        <div>
            <ThemeProvider theme={theme}>
                <AppBar position="static">
                    <Toolbar>
                        <Grid
                            container
                            xs={6}
                            justifyContent="flex-start"
                            color={Colors.textDark}
                            style={{ marginLeft: "20px" }}
                        >
                            <Image src={SolidGuard} alt="SG" width={30} height={10} />
                            <Link
                                href={"/"}
                                passHref>
                                <Typography variant="h5" component="div" style={{ marginLeft: "10px" }}>
                                    SolidGuard
                                </Typography>
                            </Link>

                        </Grid>
                        <Grid container
                            xs={6}
                            justifyContent="flex-end"
                            color={Colors.textDark}
                        >
                            <NavLink text="About Us" link="/about" />
                            <NavLink text="Security Check" link={userId ? "/securitycheck" : "/signin"} />
                            <NavLink text="Attack Library" link="/attacklibrary" />
                            <NavLink text="Contribute" link={userId ? "/contribute" : "/signin"} />
                            {
                                userId ?
                                    <Link href="/dashboard">
                                        <Avatar>
                                            <Image src={avatar} alt="hi" />
                                        </Avatar>
                                    </Link> :
                                    <Button href={"/signin"} style={{ marginRight: "14px", textTransform: 'none', backgroundColor: 'black', padding: "5px 16px 5px 16px" }} component="a">
                                        <Typography>Sign In</Typography>
                                    </Button>
                            }
                        </Grid>
                    </Toolbar>
                </AppBar>
            </ThemeProvider>
        </div>
    )
}

export default Navbar