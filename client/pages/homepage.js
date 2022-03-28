import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import { createTheme, ThemeProvider, styled } from "@mui/material/styles"
import Colors from "../styles/colors.js"
import Link from 'next/link'
import Image from 'next/image'
import SGSim from "../styles/SG_sim.svg";
import SGBanner from "../styles/SG_banner.svg";
import SGLibrary from "../styles/SG_library.svg";

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

const HomepageBlock = (props) => {
    return (
        <div className="HomepageBlockContainer" style={{ background: props.banner ? `linear-gradient(${Colors["3"]},${Colors["4"]})` : Colors["4"] }}>

            <div className="HomepageTextBlock">
                <Typography
                    className="HomepageBlockText"
                    variant="h6"
                    align="left"
                    color={Colors.textLight}
                >
                    {props.label}
                </Typography>
            </div>

            <div className="HomepageButtonBlock">
                <Link
                    href={props.link}
                    passHref>
                    <Button className="HomepageButton" variant="contained" color="primary">
                        <Typography variant="h6">
                            {props.buttonText}
                        </Typography>
                    </Button>
                </Link>
            </div>

            {props.banner ? <Image className="BannerImage" src={SGLibrary} alt="" layout="fill" /> : null}

        </div>
    )
}

const Homepage = (props) => {
    return (
        <ThemeProvider theme={theme}>

            <Grid className="HomepageContainer" container direction="row">
                <Grid className="LandingRowContainer" container xs={12} style={{ backgroundColor: Colors[5] }}>
                    <Grid
                        className="LandingTextContainer"
                        container
                        xs={8}
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Typography
                            id="LandingText"
                            variant="h4"
                            align="left"
                        >
                            We are an open sourced attack library
                            created to help blockchain applications
                            enhance their security
                        </Typography>
                    </Grid>

                    <Grid
                        className="LandingImageContainer"
                        item
                        xs={4}
                        style={{ background: `linear-gradient(to right, ${Colors["5"]} 40%,${Colors["1"]} 440%)` }}
                    >
                        <Image src={SGSim} alt="hi" />
                    </Grid>

                </Grid>

                <Grid container xs={6} direction="column" style={{ backgroundColor: "green" }}>
                    <HomepageBlock label="A developer and Just want to see the attack library?" buttonText="Attack Library" backgroundColor={Colors[4]} banner={true} link="/attacklibrary" />
                    <HomepageBlock label="join the community and help contribute to our library so other developers to learn from your example" buttonText="Contribute Now" backgroundColor={Colors[4]} link="/contribute" />
                </Grid>

                <Grid
                    className="InstructionsBlockContainer"
                    container
                    xs={6}
                    justifyContent="center"
                    alignItems="center"
                    style={{ background: `linear-gradient(to right, ${Colors["3"]} 20%,${Colors["4"]} 100%)` }}
                >
                    <div style={{ width: "80%" }}>
                        <Typography
                            variant="h5"
                            align="left"
                            color={Colors.textLight}
                        >
                            Find out if your application can survive our hacking simulator just by signing up and pasting your blockcahin address.
                        </Typography>
                    </div>
                    <div style={{ marginLeft: "auto", marginTop: "auto" }}>
                        <Link
                            href={"/signin"}
                            passHref>
                            <Button className="HomepageButton" variant="contained" color="primary">
                                <Typography variant="h6">
                                    Get Started Now!
                                </Typography>
                            </Button>
                        </Link>
                    </div>
                    <Image className="BannerImage" src={SGBanner} alt="" layout="fill" />
                </Grid>
            </Grid>

        </ThemeProvider >
    )
}

export default Homepage
