import * as React from "react"
import Box from "@mui/material/Box"
import Colors from "../styles/colors.js"
import Modal from "@mui/material/Modal"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import SyntaxHighlighter from "react-syntax-highlighter"
import { docco } from "react-syntax-highlighter/dist/cjs/styles/hljs"
import { dark } from "react-syntax-highlighter/dist/cjs/styles/hljs"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import CheckBoxIcon from "@mui/icons-material/CheckBox"
import LinkIcon from '@mui/icons-material/Link';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from "@mui/icons-material/Close"
import IconButton from "@mui/material/IconButton"
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import DownloadIcon from "@mui/icons-material/Download"
import { useState, useContext } from "react"
import { flexbox } from "@mui/system"
import { AuthContext } from './authContext'
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { fetchAPI } from "./fetchAPI.js"

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "955px",
    height: "61%",
    bgcolor: "background.paper",
    borderRadius: "10px",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3
}

const statuses = {
    Approved: "#95EE9E",
    "On Hold": "#D8E1FF",
    Unapproved: "#FF6060",
    Processing: "#D9D9D9"
}

const NestedModal = (props) => {
    let verified = props.attackList[props.index].verified
    let baseUrl = process.env.ETHERSCAN_URL != null ? process.env.ETHERSCAN_URL : 'https://rinkeby.etherscan.io/'
    let etherscan = `${baseUrl}address/${props?.attackList[props.index]?.targetAddr}`
    const [index, setIndex] = useState(props.index)

    const prevAttack = () => {
        if (index != 0) {
            setIndex(index - 1)
        }
    }

    const nextAttack = () => {
        if (index != props.attackList.length - 1) {
            setIndex(index + 1)
        }
    }

    const onVerify = async (e) => {
        const response = await fetchAPI(`
        mutation verifyExploit($input: ExploitIdParamDto!) {
            verifyexploit(exploitId: $input)
        }
        `,
        {
            input: {
                exploitId: props.attack.id,
            }
        })
        if (!response.errors) {
            props.setStatus("Approved")
            props.setOpen(false)
            await props.fetchAttacks()
        } else {
            console.log("error") // unauthorized
            props.setOpen(false)
        }
    }

    const [authState, updateAuthState] = useContext(AuthContext);
    const role = authState.role;

    return (
        <div>
            <Modal
                open={props.open}
                onClose={() => props.setOpen(false)}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
                className="AttackModalContainer"
            >
                <Box sx={style}>
                    <div className="ModalHeader">
                        <div>
                            <TableRow>
                                <TableCell>
                                    <h2
                                        id="parent-modal-title"
                                    >
                                        {props.attackList[index].name}
                                    </h2>
                                </TableCell>
                                <TableCell>Published on{" "} {props.attackList[index].createdAt}</TableCell>
                                <TableCell>Author: {props.attackList[index]?.author?.name}</TableCell>
                                <TableCell align="right">
                                    <div className="Tags">
                                        <Stack direction="row" spacing={1}>
                                            <Chip
                                                label={"Status: " + props.status}
                                                style={{
                                                    backgroundColor:
                                                        statuses[props.status]
                                                }}
                                            />
                                        </Stack>
                                    </div>
                                </TableCell>
                                {!verified && (role === "ADMIN")  ?
                                    <TableCell align="right">
                                        <Button
                                            className="AcceptButton"
                                            variant="contained"
                                            startIcon={<CheckBoxIcon />}
                                            onClick={onVerify}
                                        >
                                            <Typography variant="button" color={Colors["textDark"]}>
                                                Approve
                                            </Typography>
                                        </Button>
                                    </TableCell>
                                    : null
                                }
                                <TableCell>
                                    <IconButton
                                        component="span"
                                        onClick={() => props.setOpen(false)}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                            </div>
                            <Typography
                                variant="body1"
                                color={Colors["textDark"]}
                                style={{ height: "80px", width: "90%", marginTop: "16px", marginBottom: "14px", overflow: "scroll" }}
                            >
                                {props.attackList[index].description.replace("\\", "")}
                            </Typography>
                        <Typography variant="h5">Smart Contract</Typography>
                        <div style={{ width: "90%", marginBottom: "20px" }}>
                            <hr />
                        </div>
                        <div style={{ display: "flex", flexDirection: "row", height: "14px" }}>
                            <Typography variant="body1" style={{ marginRight: "10px" }}><b>Contracts:</b></Typography>
                            <Typography
                                variant="body2"
                                style={{ marginTop: "2px" }}
                                color={Colors["textDark"]}
                            >
                                {props.attackList[index].targetNames.join(', ')}
                            </Typography>
                        </div>
                        <div style={{ display: "flex", flexDirection: "row", height: "45px" }}>
                            <Typography variant="body1" style={{ marginTop: "8px", marginRight: "10px" }}><b>Address:</b></Typography>
                            <SyntaxHighlighter
                                className="CodePreview"
                                style={{ textColor: 'black' }}
                                onClick={() => navigator.clipboard.writeText(props.attackList[index].targetAddr)}
                            >
                                {props.attackList[index].targetAddr}
                            </SyntaxHighlighter>
                        </div>
                            <Button
                                component="span"
                                onClick={() => navigator.clipboard.writeText(props.attackList[index].targetAddr)}
                                startIcon={<LinkIcon />}
                                style={{ color: "black" }}
                            >
                                <a href={etherscan} >Open in Etherscan</a>
                            </Button>
                    </div>
                    <div>
                        <div style={{ display: "flex", flexDirection: "row", marginBottom: "100px", justifyContent: 'space-between' }}>
                            <IconButton
                                className="LeftRightButton"
                                component="span"
                                onClick={prevAttack}
                            >
                                <KeyboardArrowLeftIcon />
                            </IconButton>
                            <IconButton
                                className="LeftRightButton"
                                component="span"
                                onClick={nextAttack}
                            >
                                <KeyboardArrowRightIcon />
                            </IconButton>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default NestedModal
