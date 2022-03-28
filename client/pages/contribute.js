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

    const [code, setCode] = React.useState("pragma solidity ^0.8.10;");
    const [name, setName] = React.useState("");
    const [author, setAuthor] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    let attackBody = {
        name: name,
        author: author,
        description: description,
        script: code,
        targetAuthor: "OpenZeppelin",
        targetRepo: "openzeppelin-contracts",
        targetPath: "contracts/governance/TimelockController.sol",
        targetRef: "24a0bc23cfe3fbc76f8f2510b78af1e948ae6651"
    }

    const uploadAttack = async () => {
        console.log(attackBody);
        setLoading(true);
        const response = await fetch("http://localhost:3001/exploit", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(attackBody)
        });
        setLoading(false);

        if (response.status === 201) {
            response.json().then(data => {
                console.log(data);
            })
        } else {
            alert("Error");
        }
    }

    return (
        <ThemeProvider theme={theme}>

            <Grid className="HomepageContainer" container direction="row" >
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
                            Have an example of an exploit you'd like to share? Contribute it here!
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

            </Grid>
            <div style={{ height: "160px", display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "0 40px 40px 40px", marginBottom: "40px", backgroundColor: Colors[5] }}>
                <div style={{ height: "160px", display: "flex", flexDirection: "column" }}>
                    <TextField
                        id="outlined-multiline-static"
                        variant="filled"
                        required
                        label="Attack Name"
                        style={{ width: "300px", height: "90%" }}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        id="outlined-multiline-static"
                        variant="filled"
                        required
                        label="Author"
                        style={{ width: "300px", height: "90%" }}
                        onChange={(e) => setAuthor(e.target.value)}
                    />
                </div>
                <TextField
                    id="outlined-multiline-static"
                    label="Attack Description"
                    variant="outlined"
                    style={{ width: "500px" }}
                    multiline
                    rows={5}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div style={{ height: "160px", width: "500px", display: "flex", flexDirection: "column", justifyContent: "space-between", paddingBottom: "40px" }}>
                    <Typography
                        variant="body1"
                        align="left"
                    >
                        Please try to ensure your exploit is valid. After uploading, your code will be placed under review for an administrator to verify.
                    </Typography>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <Button variant="contained" startIcon={<UploadIcon />} style={{ width: "180px", marginRight: "20px" }} onClick={() => {
                            console.log(uploadAttack());
                        }}>
                            Upload
                        </Button>
                        <Typography
                            variant="body1"
                            align="left"
                        >
                            {loading ? "Upload in progress..." : ""}
                        </Typography>
                    </div>
                </div>
            </div>
            <div style={{ height: "400px", display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
                <TextField
                    id="outlined-multiline-static"
                    variant="outlined"
                    label="Attack Code (Solidity)"
                    style={{ width: "700px", height: "90%" }}
                    multiline
                    rows={18}
                    defaultValue={"pragma solidity ^0.8.10;"}
                    onChange={(e) => setCode(e.target.value)}
                />
                <SyntaxHighlighter className="CodeUploads" language="solidity" style={dark} showLineNumbers>
                    {code}
                </SyntaxHighlighter>
            </div>
        </ThemeProvider >
    )
}

export default ContributePage
