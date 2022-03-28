import theme from "../styles/themes.js"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import Grid from "@mui/material/Grid"
import Colors from "../styles/colors.js"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Link from 'next/link'
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import AttackCard from "../components/attackCard"
import { useEffect, useState } from "react";
import { responseSymbol } from "next/dist/server/web/spec-compliant/fetch-event"

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 4px",
    borderRadius: "10px",
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: Colors["1"],
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    backgroundColor: Colors["1"],
    width: "15%",
    borderRadius: "10px 0 0 10px",
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    marginLeft: "10px",
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(8)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20vw',
        },
    },
}));

let tempList = Array.from(Array(10), (_, x) => {
    return {
        attackName: "#" + x.toString() + " Attack",
        author: Math.random().toString(16),
        attackDescription: "bonjour" + x.toString() + "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
        publishDate: "1/7/2022"
    }
});

const AttackLibrary = (props) => {

    const [search, setSearch] = useState("");
    const [attacks, setAttacks] = useState([]);

    const fetchAttacks = async () => {

        const response = await fetch("http://localhost:3001/exploit/search?pageNo=1")
            .then(res => res.json())
            .then(data => {
                setAttacks(data.data);
            });
    }

    useEffect(() => {
        fetchAttacks();
        console.log(attacks);
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <Grid className="AttackPageContainer" container direction="row">
                <Grid className="AttackLandingRowContainer" container xs={12} style={{ backgroundColor: Colors[5] }}>
                    <Grid
                        className="LandingTextContainer"
                        container
                        xs={5}
                        alignItems="center"
                    >
                        <Typography
                            id="AttackLandingText"
                            variant="h4"
                            align="left"
                            color={Colors["1"]}
                        >
                            See past hacker histories and their exploits to see what you can do!
                        </Typography>
                        <Typography
                            id="AttackLandingSubtext"
                            variant="body1"
                            align="left"
                        >
                            Search up you attack to see if you have succeeded!
                        </Typography>
                    </Grid>
                    <Grid
                        className="LandingTextContainer"
                        container
                        xs={4}
                        alignItems="center"
                    >
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                }}
                                placeholder="Search for an attack…"
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>
                    </Grid>
                    <Grid
                        className="LandingImageContainer"
                        container
                        xs={3}
                        style={{ backgroundColor: Colors["1"] }}
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Typography
                            id="AttackControbuteText"
                            variant="body1"
                            align="left"
                        >
                            ... or contribute to our attack library by submitting here!
                        </Typography>
                        <Link
                            href={"/contribute"}
                            passHref>
                            <Button className="ContributeButton" variant="contained">
                                <Typography variant="button" color={Colors["1"]}>CONTRIBUTE</Typography>
                            </Button>
                        </Link>
                    </Grid>
                    <Grid container justifyContent="center" style={{ maxHeight: "70vh", overflow: 'scroll', marginTop: 20 }}>
                        {attacks.filter((attack) => {
                            return attack.name.toLowerCase().startsWith(search.toLowerCase());
                        }).map((row, i) => (
                            <AttackCard attack={row} index={i} attackList={attacks} />
                        ))}
                    </Grid>
                </Grid>
            </Grid>

        </ThemeProvider >)
}

export default AttackLibrary;