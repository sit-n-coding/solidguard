import * as React from "react"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import PropTypes from "prop-types"
import { createTheme, ThemeProvider, styled } from "@mui/material/styles"
import Colors from "../styles/colors.js"
import Avatar from "@mui/material/Avatar"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell, { tableCellClasses } from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import avatar from "../styles/avatar.png"
import Image from "next/image"
import SGSim from "../styles/SG_sim.svg"
import { fetchAPI } from "../components/fetchAPI.js"
import { solidGuardManagerABI } from "../components/solidGuardManagerABI"
import { ethers } from "ethers"

// example data
const sampleContract = {
    addr: "0x4367c639A21c34182CA24fcf1F868B36F04bB5fe",
    pauseable: true,
    numPauses: 5,
    createdAt: "1/4/2001",
    emailAddr: "admin@solidguard.io"
}
const sampleExploit = {
    name: "Attack",
    createdAt: "1/7/2022",
    author: {
        id: Math.random().toString(16),
        createdAt: "1/7/2022",
        name: "aaa",
        role: "ADMIN"
    },
    targetAddr: "0x51B9638447d87d69933C9888B36aDA95Ed7549c0",
    verified: false
}
let attackRows = Array.from(Array(10), (_, x) => {
    return createExploitData(
        sampleExploit.createdAt,
        sampleExploit.name,
        sampleExploit.author.name,
        sampleExploit.targetAddr,
        sampleExploit.verified
    )
})
let rows = Array.from(Array(6), (_, x) => {
    return createContractData(
        sampleContract.createdAt,
        sampleContract.emailAddr,
        sampleContract.addr,
        sampleContract.pauseable,
        sampleContract.numPauses
    )
})
// ------------------------------------------------------------------------------------------------------------------

//---- MOCK USERNAME ----------------
let populateWithTestUserame = false
let testUsername = "bot"
//-----------------------------------

const solidGuardManager = new ethers.Contract(
    "0x2D09BA684813249A7ea06c7E445E3Eb3B50143B8", // FIXME: Refactor into constants folder
    solidGuardManagerABI,
    ethers.getDefaultProvider(ethers.providers.getNetwork("goerli")) // FIXME: Refactor into constants folder
)

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14
    }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover
    },
    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0
    }
}))

function createContractData(createdAt, emailAddr, addr, pauseable, numPauses) {
    return { createdAt, emailAddr, addr, pauseable, numPauses }
}

function createExploitData(createdAt, attackName, author, link, verified) {
    return { createdAt, attackName, author, link, verified }
}

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

function TabPanel(props) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    )
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`
    }
}

const Dashboard = (props) => {
    const [subscriptions, setSubscriptions] = React.useState([])
    const [value, setValue] = React.useState(0)
    const [page, setPage] = React.useState(1)
    const [total, setTotal] = React.useState(0)
    const [username, setUsername] = React.useState("")

    const getUserInfo = async () => {
        if (populateWithTestUserame) {
            setUsername(testUsername)
            return
        }
        try {
            const res = await fetchAPI("/user", { method: "GET" })
            const data = await res.json()
            setUsername(data.username)
        } catch (err) {
            console.error(err)
        }
    }

    const getDashboardInfo = async () => {
        try {
            // fetch sub information by API
            const res = await fetchAPI(`/subscribe/${page}`, { method: "GET" })
            const data = await res.json()
            let newSubs = data.subscriptions
            const subAddrs = newSubs.map(({ contractAddr }) => contractAddr)

            // save total number of subscriptions
            setTotal(data.total)

            // fetch smart contract's pauses by blockchain
            const pausePerAddr = await solidGuardManager.batchGetPauses(
                subAddrs
            )

            // create subscription objects
            for (let i = 0; i < newSubs.length; i++) {
                newSubs[i].numPauses = parseInt(pausePerAddr[i].toString())
            }

            setSubscriptions(newSubs)
        } catch (err) {
            console.error(err)
        }
    }

    React.useEffect(getUserInfo, [])
    React.useEffect(getDashboardInfo, [page])

    const handleTabChange = (event, newValue) => {
        setValue(newValue)
    }

    const handlePageChange = (event, newPage) => {
        setPage(newPage + 1)
    }

    return (
        <div
            className="DashboardContainer"
            style={{ height: "80vh", backgroundColor: Colors["4"] }}
        >
            <ThemeProvider theme={theme}>
                <div
                    className="LandingAvatarContainer"
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        height: "25%",
                        backgroundColor: "#F5F5F5",
                        alignItems: "center"
                    }}
                >
                    <Avatar
                        sx={{
                            bgcolor: Colors[2],
                            height: "12vh",
                            width: "12vh",
                            margin: "0 20px 0 40px"
                        }}
                    >
                        <Image src={avatar} alt="hi" />
                    </Avatar>
                    <div>
                        <Typography variant="h3">{username}</Typography>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginLeft: "auto",
                            height: "90%"
                        }}
                    >
                        <Image src={SGSim} alt="Dashboard" />
                    </div>
                </div>
                <Box sx={{ width: "100%" }}>
                    <Box
                        sx={{
                            borderBottom: 1,
                            borderColor: "divider",
                            backgroundColor: "#F5F5F5"
                        }}
                    >
                        <Tabs
                            value={value}
                            onChange={handleTabChange}
                            aria-label="basic tabs example"
                        >
                            <Tab label="Exploits" {...a11yProps(0)} />
                            {/* <Tab label="Exploits" {...a11yProps(1)} /> */}
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <TableContainer
                            component={Paper}
                            style={{ height: "48vh" }}
                        >
                            <Table
                                sx={{ minWidth: 700 }}
                                aria-label="customized table"
                            >
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>
                                            Created At
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            Email Address
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            Address
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            Pauseable
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            # Pauses
                                        </StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {subscriptions.map((sub) => (
                                        <StyledTableRow key={sub.addr}>
                                            <StyledTableCell align="left">
                                                {sub.createdAt}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                {sub.emailAddr}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                {sub.contractAddr}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                {sub.pausable + ""}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                {sub.numPauses + ""}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            component="div"
                            count={total}
                            page={page - 1}
                            onPageChange={handlePageChange}
                            rowsPerPage={10}
                            rowsPerPageOptions={[]}
                            sx={{
                                color: "white"
                            }}
                        />
                    </TabPanel>
                    {/* <TabPanel value={value} index={1}>
                        <TableContainer component={Paper} style={{ height: "50vh" }}>
                            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="left">Attack Name</StyledTableCell>
                                        <StyledTableCell align="left">Date Published</StyledTableCell>
                                        <StyledTableCell align="left">Verified</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {attackRows.map((row) => (
                                        <StyledTableRow key={row.addr}>
                                            <StyledTableCell align="left">{row.attackName}</StyledTableCell>
                                            <StyledTableCell align="left">{row.createdAt}</StyledTableCell>
                                            <StyledTableCell align="left">{row.verified + ""}</StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel> */}
                </Box>
            </ThemeProvider>
        </div>
    )
}

export default Dashboard
