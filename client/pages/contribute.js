import * as React from "react"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import { createTheme, ThemeProvider, styled } from "@mui/material/styles"
import Colors from "../styles/colors.js"
import Image from "next/image"
import SGSim from "../styles/SG_sim.svg"
import SGBanner from "../styles/SG_banner.svg"
import SGLibrary from "../styles/SG_library.svg"
import SyntaxHighlighter from "react-syntax-highlighter"
import { dark } from "react-syntax-highlighter/dist/cjs/styles/hljs"
import TextField from "@material-ui/core/TextField"
import UploadIcon from "@mui/icons-material/Upload"
import { UserContext } from '../components/userContext'
import { fetchAPI } from "../components/fetchAPI"

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

const ContributePage = (props) => {
    const [name, setName] = React.useState("")
    const [contractAddr, setContractAddr] = React.useState("")
    const [contractName, setContractName] = React.useState("");
    const [description, setDescription] = React.useState("")
    const [loading, setLoading] = React.useState(false)

    let attackBody = {
        name: name,
        description: description,
        targetNames: contractName.split(','),
        targetAddr: contractAddr,
    }

    const uploadAttack = async () => {
        console.log(attackBody)
        setLoading(true)
        const response = await fetchAPI("/exploit/", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(attackBody)
        })
        setLoading(false)

        if (response.status === 201) {
            response.json().then((data) => {
                console.log(data)
            })
        } else {
            alert("Error")
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Grid className="HomepageContainer" container direction="row">
                <Grid
                    className="LandingRowContainer"
                    container
                    xs={12}
                    style={{ backgroundColor: Colors[5] }}
                >
                    <Grid
                        className="LandingTextContainer"
                        container
                        xs={8}
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Typography id="LandingText" variant="h4" align="left">
                            Have an example of an exploit you'd like to share?
                            Contribute it here!
                        </Typography>
                    </Grid>

                    <Grid
                        className="LandingImageContainer"
                        item
                        xs={4}
                        style={{
                            background: Colors["5"]
                        }}
                    >
                        <Image src={SGSim} alt="hi" />
                    </Grid>
                </Grid>
            </Grid>
            <div
                style={{
                    height: "320px",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: "0 40px 40px 40px",
                    marginBottom: "240px",
                    backgroundColor: Colors[5]
                }}
            >
                <div
                    style={{
                        height: "160px",
                        display: "flex",
                        flexDirection: "column"
                    }}
                >
                    <TextField
                        id="outlined-multiline-static"
                        variant="filled"
                        required
                        label="Attack Name"
                        style={{ width: "480px", height: "90%" }}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'  }}>
                        <TextField
                            id="outlined-multiline-static"
                            variant="filled"
                            required
                            label="Contract Address"
                            style={{ width: "240px", height: "90%", marginRight: "10px" }}
                            onChange={(e) => setContractAddr(e.target.value)}
                        />
                        <TextField
                            id="outlined-multiline-static"
                            variant="filled"
                            required
                            label="Contract Name"
                            style={{ width: "230px", height: "90%" }}
                            onChange={(e) => setContractName(e.target.value)}
                        />
                    </div>
                </div>
                <TextField
                    id="outlined-multiline-static"
                    label="Attack Description"
                    variant="outlined"
                    style={{ width: "400px" }}
                    multiline
                    rows={7}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div
                    style={{
                        height: "160px",
                        width: "500px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        paddingBottom: "40px"
                    }}
                >
                    <Typography variant="body1" align="left">
                        Please try to ensure your exploit is valid. After
                        uploading, your exploit will be placed under review for an
                        administrator to verify.
                    </Typography>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <Button
                            variant="contained"
                            startIcon={<UploadIcon />}
                            style={{ width: "180px", marginRight: "20px" }}
                            onClick={() => {
                                console.log(uploadAttack())
                            }}
                        >
                            Upload
                        </Button>
                        <Typography variant="body1" align="left">
                            {loading ? "Upload in progress..." : ""}
                        </Typography>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    )
}

export default ContributePage
