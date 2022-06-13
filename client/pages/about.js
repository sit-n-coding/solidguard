import * as React from "react"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import { useTheme, createTheme, ThemeProvider, styled } from "@mui/material/styles"
import SGSim from "../styles/mascot.png"

import Stephen from "../styles/members/stephen.png"
import Nancy from "../styles/members/nancy.jpg"
import Jackie from "../styles/members/jackie.png"
import Vivek from "../styles/members/vivek.png"
import Jan from "../styles/members/jan.png"
import Peter from "../styles/members/peter.jpeg"
import Mexi from "../styles/members/mexi.png"
import Angela from "../styles/members/angela.png"
import Amy from "../styles/members/amy.jpg"
import Leo from "../styles/members/leo.PNG"
import Glenn from "../styles/members/glenn.webp"

import Image from "next/image"
import Box from '@mui/material/Box';
import Colors from "../styles/colors.js"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, Link } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

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

const members = [
    ["Jan Garong", Jan, "Lead Software Engineer", { linkedIn: "https://linkedin.com/in/jangarong", github: "https://github.com/jangarong", website: "https://jangarong.github.io/ " }],
    ["Meixuan (Mexi) Lu", Mexi, "Backend Engineer", { linkedIn: "https://www.linkedin.com/in/meixuan-mexi-lu-5103621b6/" }],
    ["Ruo Ning (Nancy) Qiu", Nancy, "Backend Engineer", { linkedIn: "https://www.linkedin.com/in/nancy-ruoning-qiu" }],
    ["Vivek Kandathil", Vivek, "Frontend Engineer", { linkedIn: "https://www.linkedin.com/in/vivekkandathil/", website: "https://vivek.kandathil.ca/", github: "https://github.com/vivekandathil" }],
    ["Peter Pham", Peter, "Frontend Engineer", { linkedIn: "https://www.linkedin.com/in/peter-pham01/", github: "https://github.com/phampe68", website: "https://peter-pham.netlify.app/" }],
    ["Glenn Ye", Glenn, "Frontend Engineer", { linkedIn: "https://www.linkedin.com/in/glenn-ye/", github: "https://github.com/LegoCityMan7063" }],
    ["Angela Shen", Angela, "Lead Designer", { linkedIn: "https://www.linkedin.com/in/angela-shen-428468204/" }],
    ["Amy Li", Amy, "Graphic Designer", {}],
    ["Jackie", Jackie, "Graphic Designer", { twitter: "https://twitter.com/jackyljs" }],
    ["Si (Leo) Wang", Leo, "DevOps Engineer", { linkedIn: "https://www.linkedin.com/in/leo-wang14/", website: "https://asi4nn.github.io/" }],
    ["Stephen Guo", Stephen, "DevOps Engineer", { linkedIn: "https://www.linkedin.com/in/stephen-guo-399959192/", website: "https://epicsteve2.github.io/", github: "https://github.com/Epicsteve2" }],
]

const MemberInformation = (props) => {
    return (

        <Card sx={{ display: 'flex', margin: '20px', flexDirection: "column", justifyContent: "center", alignItems: "center", height: "400px", width: "240px", boxShadow: "none", borderRadius: "10px" }}>
     
            <div style={{ height: "200px", width: "200px", borderRadius: '50%', overflow: 'hidden', marginTop: "30px" }}>
                <Image height="500px" width="500px" objectFit="cover" src={props.member[1]} />
            </div>
            <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography component="div" variant="h6" align="center">
                    {props.member[0]}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" component="div" align="center">
                    {props.member[2]}
                </Typography>
                <div style={{ display: 'flex', flexDirection: "row", justifyContent: 'space-evenly' }}>
                    {Object.keys(props.member[3]).includes("linkedIn") ? <IconButton><a href={props.member[3].linkedIn} target="_blank" rel="noopener noreferrer"><LinkedInIcon /></a></IconButton> : null}
                    {Object.keys(props.member[3]).includes("twitter") ? <IconButton><a href={props.member[3].twitter} target="_blank" rel="noopener noreferrer"><TwitterIcon /></a></IconButton> : null}
                    {Object.keys(props.member[3]).includes("website") ? <IconButton><a href={props.member[3].website} target="_blank" rel="noopener noreferrer"><OpenInNewIcon /></a></IconButton> : null}
                    {Object.keys(props.member[3]).includes("github") ? <IconButton><a href={props.member[3].github} target="_blank" rel="noopener noreferrer"><GitHubIcon /></a></IconButton> : null}
                </div>
            </CardContent>
        </Card>

    )
}

const AboutPage = (props) => {
    return (
        <ThemeProvider theme={theme}>
            <Grid
                className="LandingRowContainer"
                container
                xs={12}
                style={{ backgroundColor: Colors[5], height: "30vh" }}
            >
                <Grid
                    className="LandingTextContainer"
                    container
                    xs={8}
                >
                    <Typography id="LandingText" variant="h4" align="left">
                        We created SolidGuard to prevent unecessary losses for blockchain businesses.
                    </Typography>
                </Grid>
                <Grid
                    className="LandingImageContainer"
                    item
                    xs={4}
                    style={{ backgroundColor: Colors[5] }}
                >
                    <Image src={SGSim} alt="SolidGuard" style={{ height: "auto" }} />
                </Grid>
            </Grid>
            <Typography style={{ padding: '40px', height: "20vh", backgroundColor: Colors[5] }} variant="h5" align="left">
                Meet the team that made this happen!
            </Typography>
            <div style={{ backgroundColor: Colors[4], display: 'flex', alignItems: 'center', height: '30vh' }}>
                <Typography variant="h4" style={{ color: 'white', fontSize: "60px", marginLeft: "40px" }}>
                    Our Team
                </Typography>
            </div>
            <div style={{ backgroundColor: Colors[4] }}>
                <Grid
                    container
                    justifyContent="center"
                    style={{
                        padding: "0 0 2% 0",
                    }}
                >
                    {members.map((member, i) => {
                        return (
                            <div style={{ display: 'flex', flexDirection: 'row' }} key={i}>
                                <MemberInformation member={member} />
                            </div>
                        )
                    })}
                </Grid>
            </div>
            <Typography variant="h6" style={{ margin: "40px" }}>Powered by Etherscan.io APIs</Typography>
        </ThemeProvider>
    )
}

export default AboutPage
