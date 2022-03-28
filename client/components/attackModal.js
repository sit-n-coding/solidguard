import * as React from 'react';
import Box from '@mui/material/Box';
import Colors from "../styles/colors.js"
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { dark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DangerousIcon from '@mui/icons-material/Dangerous';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import DownloadIcon from '@mui/icons-material/Download';
import { useState } from "react";
import { flexbox } from '@mui/system';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "80%",
    height: "90%",
    bgcolor: 'background.paper',
    borderRadius: "10px",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

const statuses = {
    "Approved": "#95EE9E",
    "On Hold": "#D8E1FF",
    "Unapproved": "#FF6060",
    "Processing": "#D9D9D9"
}

const VerifiedHeader = (props) => {
    return (<div classname="ProcessingContainer">
        <div className="CloseButton">
            <IconButton component="span" onClick={() => props.setOpen(false)}>
                <CloseIcon />
            </IconButton>
        </div>
    </div>)
}

const ProcessingHeader = (props) => {
    return (
        <div classname="ProcessingContainer">
            <div className="CloseButton">

                <div className="ProcessingButtonList">
                    <Button className="AcceptButton" variant="contained" startIcon={<CheckBoxIcon />} onClick={() => props.setStatus("Approved")}>
                        <Typography variant="button" color={Colors["textDark"]}>Approve</Typography>
                    </Button>
                    <Button className="HoldButton" variant="contained" startIcon={<AccessTimeIcon />} onClick={() => props.setStatus("Processing")}>
                        <Typography variant="button" color={Colors["textDark"]}>On Hold</Typography>
                    </Button>
                    <Button className="UnapproveButton" variant="contained" startIcon={<DangerousIcon />} onClick={() => props.setStatus("Unapproved")}>
                        <Typography variant="button" color={Colors["textDark"]}>Deny</Typography>
                    </Button>
                </div>
                <IconButton component="span" onClick={() => props.setOpen(false)}>
                    <CloseIcon />
                </IconButton>
            </div>



        </div>)
}

const NestedModal = (props) => {

    const codeString = 'pragma solidity ^0.4.22;\ncontract helloWorld {\nfunction renderHelloWorld () public pure returns (string) {\nreturn \'Hello, World!\';\n}}';
    let verified;
    const [index, setIndex] = useState(props.index);

    React.useEffect(() => {
        verified = props.attackList[index].verify;
    }, [])

    const prevAttack = () => {
        if (index != 0) {
            setIndex(index - 1);
        }
    }

    const nextAttack = () => {
        if (index != props.attackList.length - 1) {
            setIndex(index + 1);
        }
    }

    const downloadTxtFile = () => {
        const element = document.createElement("a");
        const file = new Blob([codeString],
            { type: 'text/plain;charset=utf-8' });
        element.href = URL.createObjectURL(file);
        element.download = props.attackList[index].name + ".txt";
        document.body.appendChild(element);
        element.click();
    }

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
                            <div className="TitleRow" >
                                <h2 style={{ width: "80%" }} id="parent-modal-title">{props.attackList[index].name}</h2>
                                <div className="Tags">
                                    <Stack direction="row" spacing={1}>
                                        <Chip label={"Status: " + props.status} style={{ backgroundColor: statuses[props.status] }} />
                                    </Stack>
                                </div>
                            </div>
                            <div className="SubtitleRow" >
                                <Typography variant="body1" color={Colors["4"]}>Published on {props.attackList[index].createdAt}</Typography>
                                <Typography variant="body1" color={Colors["4"]}>Author: {props.attackList[index].author}</Typography>
                            </div>
                            <div style={{ height: "50px", overflow: "scroll" }}>
                                <Typography variant="body1" color={Colors["textDark"]}>{props.attackList[index].description}</Typography>
                            </div>
                        </div>
                        {verified ? <VerifiedHeader /> : <ProcessingHeader setOpen={props.setOpen} setStatus={props.setStatus} />}
                    </div>
                    <div className="CodeButtonsContainer">
                        <div className="LeftRightButtonContainer">
                            <IconButton className="LeftRightButton" component="span" onClick={prevAttack}>
                                <KeyboardArrowLeftIcon />
                            </IconButton>
                        </div>
                        <div>
                            <SyntaxHighlighter className="CodePreview" language="solidity" style={dark} showLineNumbers>
                                {props.attackList[index].script}
                            </SyntaxHighlighter>
                            <Button startIcon={<DownloadIcon />} onClick={downloadTxtFile}>
                                <Typography variant="button" color={Colors["textDark"]}>Download text file</Typography>
                            </Button>
                        </div>
                        <div className="LeftRightButtonContainer">
                            <IconButton className="LeftRightButton" component="span" onClick={nextAttack}>
                                <KeyboardArrowRightIcon />
                            </IconButton>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default NestedModal;