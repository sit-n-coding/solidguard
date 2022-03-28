import * as React from 'react';
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import { createTheme, ThemeProvider, styled } from "@mui/material/styles"
import Colors from "../styles/colors.js"
import Image from 'next/image'
import SGSim from "../styles/SG_sim.svg";
import SGBanner from "../styles/SG_banner.svg";
import SGLibrary from "../styles/SG_library.svg";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import TextField from '@material-ui/core/TextField';
import UploadIcon from '@mui/icons-material/Upload';

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

const ContributePage = (props) => {

    return (
        <ThemeProvider theme={theme}>
            <Typography
                id="LandingText"
                variant="h6"
                align="left"
            >
                <ul>
                    <li>UI/UX Designer: Angela Shen.</li>
                    <li>Graphic Designer: Amy Li.</li>
                    <li>Frontend Engineer: Vivek Kandathil, Peter Pham.</li>
                    <li>Backend Engineer: Jan Garong, Meixuan (Mexi) Lu, Ruo Ning (Nancy) Qiu.</li>
                    <li>DevOps Engineer: Si (Leo) Wang.</li>
                </ul>
            </Typography>
        </ThemeProvider >
    )
}

export default ContributePage
