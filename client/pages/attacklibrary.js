import { Suspense } from "react"
import * as React from "react"
import theme from "../styles/themes.js"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import Grid from "@mui/material/Grid"
import Colors from "../styles/colors.js"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Link from "next/link"
import { styled, alpha } from "@mui/material/styles"
import InputBase from "@mui/material/InputBase"
import SearchIcon from "@mui/icons-material/Search"
import AttackCard from "../components/attackCard"
import { useEffect, useState } from "react"
import { responseSymbol } from "next/dist/server/web/spec-compliant/fetch-event"
import { fetchAPI } from "../components/fetchAPI"
import { AuthContext } from "../components/authContext"

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 4px",
    borderRadius: "10px",
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
        backgroundColor: Colors["1"]
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto"
    }
}))

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    backgroundColor: Colors["1"],
    width: "15%",
    borderRadius: "10px 0 0 10px",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    marginLeft: "10px",
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(8)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "20vw"
        }
    }
}))

// ----- USE THIS WHEN BACKEND ISSUES :( ---------------
let populateWithTestAttacks = false
let tempList = Array.from(Array(40), (_, x) => {
    return {
        id: x,
        name: "#" + x.toString() + " Attack",
        createdAt: "1/7/2022",
        author: {
            id: Math.random().toString(16),
            createdAt: "1/7/2022",
            name: "xyz",
            role: "ADMIN"
        },
        authorUserId: Math.random().toString(16),
        description:
            "According \n \"to\" % all known laws of aviation, there is no way that a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible. Yellow, black. Yellow, black. Yellow, black. Yellow, black. Ooh, black and yellow! Yeah, let's shake it up",
        targetNames: [
            "TimelockController",
            "SolidGuard1",
            "SolidGuard2",
            "SolidGuard3",
            "SolidGuard4"
        ],
        targetAddr: ["0x51B9638447d87d69933C9888B36aDA95Ed7549c0"],
        verified: false
    }
})
// ------------------------------------------------------

const AttackLibrary = (props) => {
    const [search, setSearch] = useState("")
    const [attacks, setAttacks] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    const [page, setPage] = useState(1)
    const [authState, updateAuthState] = React.useContext(AuthContext)
    const userId = authState.userId

    const fetchAttacks = async () => {
        if (populateWithTestAttacks) {
            setAttacks(tempList)
        } else {
            setTimeout(async () => {
                await fetchAPI(
                    `
                    query searchExploitByName($pageNo: Float!, $input: SearchExploitsQueryDto!) {
                        searchExploitByName(page: $pageNo, queryInfo: $input) {
                          id
                          name
                          authorName
                          description
                          targetAddr
                          targetNames
                          verified
                        }
                      }                      
                    `,
                    {
                        pageNo: page,
                        input: {
                            name: search
                        }
                    }
                )
                    .then(({ data }) => {
                        setPage(page + 1)
                        setAttacks(() => {
                            return [...attacks, ...data["searchExploitByName"]]
                        })
                    })
                    .catch((error) => {
                        return
                    })
            }, 1000)
        }
    }

    useEffect(() => {
        fetchAttacks()
        window.addEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        if (!isFetching) return
        fetchMoreAttacks()
    }, [isFetching])

    const fetchMoreAttacks = () => {
        fetchAttacks()
        setIsFetching(false)
    }

    const handleScroll = () => {
        if (
            Math.ceil(
                window.innerHeight + document.documentElement.scrollTop
            ) !== document.documentElement.offsetHeight ||
            isFetching
        )
            return
        setIsFetching(true)
        console.log(isFetching)
    }

    return (
        <ThemeProvider theme={theme}>
            <Grid className="AttackPageContainer" container direction="row">
                <Grid
                    className="AttackLandingRowContainer"
                    container
                    xs={12}
                    style={{ backgroundColor: Colors[5] }}
                >
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
                            See past hacker histories and their exploits to see
                            what you can do!
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
                                    setSearch(e.target.value)
                                }}
                                placeholder="Search for an attack…"
                                inputProps={{ "aria-label": "search" }}
                            />
                        </Search>
                    </Grid>
                    <Grid
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
                            ... or contribute to our attack library by
                            submitting here!
                        </Typography>
                        <Link
                            href={userId ? "/contribute" : "/signin"}
                            passHref
                        >
                            <Button
                                className="ContributeButton"
                                variant="contained"
                                sx={{
                                    backgroundColor: "black",
                                    borderRadius: "40px",
                                    height: "60px",
                                    width: "200px",
                                    marginBottom: "20px"
                                }}
                            >
                                <Typography
                                    variant="button"
                                    color={Colors["1"]}
                                >
                                    CONTRIBUTE
                                </Typography>
                            </Button>
                        </Link>
                    </Grid>
                    <Grid
                        container
                        justifyContent="center"
                        style={{
                            maxHeight: "70vh",
                            overflow: "scroll",
                            marginTop: 20
                        }}
                    >
                        {attacks
                            .filter((attack) => {
                                return (
                                    attack.name
                                        .toLowerCase()
                                        .indexOf(search.toLowerCase()) !== -1
                                )
                            })
                            .map((row, i) => (
                                <Suspense fallback={tempList[0]} key={i}>
                                    <AttackCard
                                        attack={row}
                                        index={i}
                                        attackList={attacks}
                                        fetchAttacks={fetchAttacks}
                                        key={i}
                                    />
                                </Suspense>
                            ))}
                    </Grid>
                    {isFetching && <h1>Fetching more attacks...</h1>}
                </Grid>
            </Grid>
        </ThemeProvider>
    )
}

export default AttackLibrary
