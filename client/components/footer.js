import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import { Container } from "@mui/material"
import Button from "@mui/material/Button"
import Link from 'next/link'
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import TwitterIcon from '@material-ui/icons/Twitter';
import FacebookIcon from '@material-ui/icons/Facebook';
import YouTubeIcon from '@material-ui/icons/YouTube';
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import Colors from "../styles/colors"

export default function Footer() {
    return (
        <div style={{ display: "flex", width: "100%", backgroundColor: Colors[3], height: "20vh", alignItems: "center", justifyContent: "center" }}>

            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "0 40px 0 40px",
                    alignItems: "center"
                }}
            >
                <Typography variant="body1" color={Colors["textLight"]}>
                    © {new Date().getFullYear()} SolidGuard
                </Typography>
                <Link
                    href={"/"}
                    passHref>
                    <Typography variant="body1" color={Colors["textLight"]} style={{ textDecoration: "underline" }}>
                        Terms
                    </Typography>
                </Link>
                <Link
                    href={"/"}
                    passHref>
                    <Typography variant="body1" color={Colors["textLight"]} style={{ textDecoration: "underline" }}>
                        Privacy
                    </Typography>
                </Link>
                <Link
                    href={"/"}
                    passHref>
                    <Typography variant="body1" color={Colors["textLight"]} style={{ textDecoration: "underline" }}>
                        Source Code
                    </Typography>
                </Link>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                }}>
                    <IconButton aria-label="delete" style={{ color: "white" }}>
                        <TwitterIcon style={{ height: "50px", width: "50px" }} />
                    </IconButton>
                    <IconButton aria-label="delete" style={{ color: "white" }}>
                        <FacebookIcon style={{ height: "50px", width: "50px" }} />
                    </IconButton>
                    <IconButton aria-label="delete" style={{ color: "white" }}>
                        <YouTubeIcon style={{ height: "50px", width: "50px" }} />
                    </IconButton>
                    <IconButton aria-label="delete" style={{ color: "white" }}>
                        <LinkedInIcon style={{ height: "50px", width: "50px" }} />
                    </IconButton>
                    <IconButton aria-label="delete" style={{ color: "white" }}>
                        <GitHubIcon style={{ height: "50px", width: "50px" }} />
                    </IconButton>
                </div>
            </div>
        </div >
    )
}
