import Typography from "@mui/material/Typography"
import Mascot from "../styles/footer.svg"
import Link from "next/link"
import IconButton from "@mui/material/IconButton"
import GitHubIcon from "@material-ui/icons/GitHub"
import Colors from "../styles/colors"
import Image from "next/image"
import { createTheme, ThemeProvider, styled } from "@mui/material/styles"
import theme from "../styles/theme.js"

export default function Footer() {
    return (
        <ThemeProvider theme={theme}>
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    backgroundColor: Colors[3],
                    height: "16vh",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        width: "100%",
                        padding: "0 0 0 40px",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="body1" color={Colors["textLight"]} style={{ marginRight: "40px" }}>
                        © {new Date().getFullYear()} SolidGuard
                    </Typography>
                        <Link href={"/about"} passHref>
                            <Typography
                                variant="body1"
                                color={Colors["textLight"]}
                                style={{ marginRight: "40px" }}
                            >
                                About Us
                            </Typography>
                        </Link>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <IconButton href="https://github.com/SolidGuard/solidguard" aria-label="delete" style={{ color: "white" }} component="a">
                                <GitHubIcon style={{ height: "50px", width: "50px" }} />
                            </IconButton>
                        </div>
                </div>
                <div style={{ marginTop: "auto" }}>
                    <Image
                        height={"160vh"}
                        src={Mascot}
                    />
                </div>
            </div>
        </ThemeProvider>
    )
}
