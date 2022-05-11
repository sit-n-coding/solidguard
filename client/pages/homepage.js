import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import * as React from "react"
import { createTheme, ThemeProvider, styled } from "@mui/material/styles"
import Colors from "../styles/colors.js"
import Link from "next/link"
import Image from "next/image"
import SGSim from "../styles/SG_sim.png"
import SGBanner from "../styles/SG_banner.svg"
import SGLibrary from "../styles/SG_library.svg"
import { AuthContext } from '../components/authContext'

const theme = createTheme({
    typography: {
        fontFamily: "Assistant"
    },

    palette: {
        primary: {
            main: Colors["1"],
            darker: "#053e85"
        }
    }
})

theme.typography.h4 = {
    fontSize: "1.2rem",
    "@media (min-width:600px)": {
        fontSize: "1.5rem"
    },
    [theme.breakpoints.up("md")]: {
        fontSize: "2.4rem"
    }
}

theme.typography.h5 = {
    fontWeight: "1000",
    fontSize: "1.2rem"
}

const Homepage = (props) => {
    const [authState, updateAuthState] = React.useContext(AuthContext);
    const userId = authState.userId;

    return (
        <div id="parentContainer" style={{ display: "flex", height: "100vh", width: "100vw", backgroundColor: Colors[5], alignItems: "center" }}>
            <ThemeProvider theme={theme}>
                <div style={{display: "flex", flexDirection: "column", width: "40%"}}>
                    <Typography align="left" variant="h4" style={{ marginLeft: "30px" }}>
                        Protect the future of blockchain,
                    </Typography>
                    <Typography align="left" variant="h4" style={{ marginLeft: "30px", marginBottom: "20px" }}>
                        one vulnerability at a time.
                    </Typography>
                    <Typography align="left" variant="h6" style={{ marginLeft: "30px" }}>
                        There's no place for hackers on blockchain - band together to strategize against exploited ledgers.
                    </Typography>

                    <div style={{display: "flex"}}>

                    <Button
                        href={userId ? "/securitycheck" : "/signin"}
                        variant="contained"
                        sx={{marginLeft: "30px", marginTop: "30px", width: "200px", height: "60px", borderRadius: "10px", backgroundColor: Colors[1] }}
                    >
                        <Typography variant="h5" style={{fontWeight: "4000"}}>Get Protected</Typography>

                    </Button>

                    <Button
                        href={userId ? "/contribute" : "/signin"}
                        variant="contained"
                        sx={{marginLeft: "30px", marginTop: "30px", width: "200px", height: "60px", borderRadius: "10px", backgroundColor: Colors[4], color: "white" }}
                    >
                        <Typography variant="h5" style={{fontWeight: "4000"}}>Contribute Now</Typography>

                    </Button>
                    </div>

                </div>
                <div style={{ height: "70%", marginLeft: "auto" }}>
                    <Image
                        src={SGSim}
                    />
                </div>
            </ThemeProvider>

        </div>

    )
}

export default Homepage
