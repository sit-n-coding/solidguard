import {
    Autocomplete,
    Button,
    getNativeSelectUtilityClasses,
    Grid,
    IconButton,
    Typography
} from "@mui/material"
import Colors from "../styles/colors"
import * as React from "react"
import TextField from "@mui/material/TextField"
import SecurityCheckSVG from "../styles/securityCheckGraphic.svg"
import Image from "next/image"
import { useState, useContext } from "react"
import DeleteIcon from "@mui/icons-material/Delete"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import { createTheme, ThemeProvider, styled } from "@mui/material/styles"
import theme from "../styles/theme.js"
import { ethers } from "ethers"
import { UserContext } from "../components/userContext"
import { getMetamaskAccounts } from '../components/web3'
import { fetchAPI } from "../components/fetchAPI"
import { useRouter } from 'next/router'
import {solidGuardManagerABI} from '../components/solidGuardManagerABI';

let autocomplete = []
let signature = ""
const solidGuardManager = new ethers.Contract(
    "0xC53Ec029Fa3B311971257d91c96Ab60EAc65Ae0b", // FIXME: Refactor into constants folder
    solidGuardManagerABI,
    ethers.getDefaultProvider(ethers.providers.getNetwork("rinkeby")) // FIXME: Refactor into constants folder
)

const PAUSE_ON_VULNERABILITY_RATE = 0.01

const SecurityCheckPage = (props) => {
    const [addressList, setAddressList] = useState([])
    const [currAddress, setCurrAddress] = useState("")
    const [currAddressId, setCurrAddressId] = useState(0)
    const [totalPauses, setTotalPauses] = useState(0)
    const [email, setEmail] = useState("")
    const router = useRouter()
    const [userState, setUserState, providerState] = useContext(UserContext)

    const SecurityCheckRow = (props) => {

        return (
            <div
                style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
                <div style={{ width: "50%" }}>
                    <Button
                        onClick={() => {
                            let newAddressList = [...addressList]
                            let selectedIndex = -1
                            addressList.forEach((a, index) => {
                                if (a.id === props.address.id)
                                    selectedIndex = index
                                return
                            })
                            newAddressList[selectedIndex].pauses++
                            setAddressList(newAddressList)
                            setTotalPauses(totalPauses + 1)
                        }}
                    >
                        +
                    </Button>
                    <Typography
                        variant="body"
                        align="left"
                        color={Colors.textLight}
                    >
                        {props.address.pauses}
                    </Typography>
                    <Button
                        onClick={() => {
                            if (props.address.pauses <= 0) return

                            let newAddressList = [...addressList]
                            let selectedIndex = -1
                            addressList.forEach((a, index) => {
                                if (a.id === props.address.id)
                                    selectedIndex = index
                                return
                            })
                            newAddressList[selectedIndex].pauses--
                            setAddressList(newAddressList)
                            setTotalPauses(totalPauses - 1)
                        }}
                    >
                        -
                    </Button>
                </div>

                <div
                    style={{
                        display: "flex",
                        width: "50%",
                        justifyContent: "flex-end",
                        alignItems: "center"
                    }}
                >
                    <Typography
                        variant="body"
                        align="left"
                        color={Colors.textLight}
                    >
                        {props.address.address}
                    </Typography>

                    <IconButton
                        aria-label="close"
                        style={{ marginLeft: "auto" }}
                        variant="contained"
                        color="warning"
                        onClick={(event) => {
                            // necesscary to remove row before grid sets focus
                            setTimeout(() => {
                                setAddressList(
                                    addressList.filter(
                                        (anAddress) =>
                                            anAddress.id !== props.address.id
                                    )
                                )
                                setTotalPauses(
                                    totalPauses - props.address.pauses
                                )
                            })
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </div>
            </div>
        )
    }

    const handleAddAddress = () => {
        if (!currAddress) return
        let found = false
        addressList.forEach((a) => {
            if (a.address === currAddress) found = true
            return
        })
        if (found) return

        const newAddress = {
            id: currAddressId,
            address: currAddress,
            pauses: 0
        }

        let newList = [...addressList]
        let addresses = []
        newList.push(newAddress)
        addresses.push(newAddress.address)
        setAddressList(newList)
        console.log(addresses)
        setCurrAddressId(currAddressId + 1)
    }

    const connectMetamask = async () => {
        let signer = providerState.web3Provider.getSigner()
        signature = await signer.signMessage(
            JSON.stringify({
                contractAddrs: addressList.map(({ address }) => address),
                emailAddrs: [email]
            }).replace(/\s+/, "")
        )
        await deposit(signer)
        await subscribe()
    }

    const subscribe = async () => {
        const subscribeBody = {
            contractAddrs: addressList.map(({ address }) => address),
            emailAddrs: [email],
            signedJSON: signature
        }
        console.log(subscribeBody)
        console.log(JSON.stringify(subscribeBody))
        const response = await fetchAPI("/subscribe/", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(subscribeBody)
        })

        if (response.status === 201) {
            response.json().then((data) => {
                console.log(data)
            })
        } else {
            alert("Error")
        }
    }

    const deposit = async (ethSigner) => {
        const addrs = addressList.map(({ address }) => address)
        const pauses = addressList.map(({ pauses }) => pauses)
        console.log(addrs, pauses)
        if (totalPauses > 0){
            await solidGuardManager.connect(ethSigner).deposit(addrs, pauses, {
                value: ethers.utils.parseEther(
                    (totalPauses * PAUSE_ON_VULNERABILITY_RATE).toString()
                )
            })
        }
    }

    React.useEffect(() => {
        console.log(autocomplete)
    }, [])

    // this will be shown if the user is not logged into metamask
    const MetamaskLogin = () => {
        const loginToMetamask = async () => {
            const accounts = await getMetamaskAccounts(providerState.mmProvider);
            setUserState({ ...userState, mmAddr: accounts ? accounts[0] : null });
        }
        return (
            <div style={{
                height:'100%', 
                width: '100%',
                display: 'flex', 
                justifyContent: 'center',
                 alignItems: 'center',
                 }}>
                <Button
                    style={{
                        backgroundColor: Colors[1],
                        borderRadius: "10px",
                        height: "70px",
                        width: "75%",

                    }}
                    onClick={loginToMetamask}
                    variant="contained"
                    color="primary"
                >
                    <Typography variant="h6" color={Colors[3]}>
                        Connect to Metamask
                    </Typography>
                </Button>
            </div>
        )
    }

    // this will be shown if the user is logged into metamask
    const SecurityCheckActivated = () => {
        return (
            <div>
                <div style={{ display: "flex", width: "100%" }}>
                    <div style={{ width: "50%" }}>
                        <Typography
                            variant="body1"
                            align="left"
                            color={Colors.textLight}
                            style={{
                                margin: "30px 20px 10px 20px",
                                width: "90%"
                            }}
                        >
                            Enter in your address to check company security
                        </Typography>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center"
                            }}
                        >
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={autocomplete}
                                freeSolo
                                sx={{ width: 300 }}
                                renderInput={(params) => (
                                    <TextField
                                        variant="filled"
                                        {...params}
                                        label="Addresses"
                                    />
                                )}
                                style={{
                                    backgroundColor: "white",
                                    margin: "auto 0 20px 20px",
                                    borderRadius: "20px",
                                    height: "50px",
                                    width: "80%"
                                }}
                                onInputChange={(e, v) => {
                                    setCurrAddress(v)
                                }}
                                variant="filled"
                            />
                            <IconButton
                                aria-label="add"
                                onClick={handleAddAddress}
                            >
                                <AddCircleIcon
                                    style={{
                                        color: Colors[1],
                                        height: "50px",
                                        width: "50px",
                                        marginBottom: "10px"
                                    }}
                                />
                            </IconButton>
                        </div>
                    </div>

                    <div
                        style={{
                            width: "50%",
                            display: "flex",
                            flexDirection: "column"
                        }}
                    >
                        <Typography
                            variant="body1"
                            align="left"
                            color={Colors.textLight}
                            style={{
                                margin: "30px 20px 20px 20px",
                                width: "90%"
                            }}
                        >
                            Enter in your email address
                        </Typography>

                        <TextField
                            id="filled-basic"
                            label="Email"
                            variant="filled"
                            style={{
                                backgroundColor: Colors[5],
                                height: "50px",
                                width: "80%",
                                margin: "auto 0 20px 20px",
                                borderRadius: "20px "
                            }}
                            onChange={(e) => {
                                setEmail(e.target.value)
                            }}
                        />
                    </div>
                </div>

                <div
                    style={{
                        height: "70%",
                        width: "100%",
                        marginTop: "30px"
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#333333",
                            width: "90%",
                            margin: "0 20px 0 20px",
                            borderRadius: "20px 20px 0 0",
                            overflow: "scroll"
                        }}
                    >
                        <div style={{ display: "flex" }}>
                            <div
                                style={{
                                    display: "flex",
                                    width: "50%",
                                    justifyContent: "center"
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    align="left"
                                    color={Colors.textLight}
                                    style={{
                                        margin: "10px 20px 0 20px",
                                        width: "90%"
                                    }}
                                >
                                    Pause on Vulnerability
                                </Typography>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    width: "50%",
                                    justifyContent: "center"
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    align="left"
                                    color={Colors.textLight}
                                    style={{
                                        margin: "10px 20px 0 20px",
                                        width: "90%"
                                    }}
                                >
                                    Address
                                </Typography>
                            </div>
                        </div>
                        <hr />
                    </div>
                    <div
                        style={{
                            backgroundColor: "#333333",
                            height: "60%",
                            width: "90%",
                            margin: "0 20px 20px 20px",
                            borderRadius: "0 0 20px 20px",
                            overflow: "scroll"
                        }}
                    >
                        {addressList.map((address) => {
                            return (
                                <SecurityCheckRow
                                    address={address}
                                    key={address}
                                />
                            )
                        })}
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            marginLeft: 20
                        }}
                    >
                        <Typography variant="body1" color="white">
                            Pause contract on vulnerability discovery? (will
                            cost {totalPauses * PAUSE_ON_VULNERABILITY_RATE}{" "}
                            ETH);
                        </Typography>
                    </div>

                    <Button
                        style={{
                            backgroundColor: Colors[1],
                            borderRadius: "10px",
                            height: "70px",
                            width: "90%",
                            marginLeft: "20px",
                            marginTop: "40px"
                        }}
                        onClick={() => connectMetamask()}
                        variant="contained"
                        color="primary"
                    >
                        <Typography variant="h6" color={Colors[3]}>
                            Submit
                        </Typography>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <Grid container style={{ height: "95vh" }}>
                <Grid
                    container
                    item
                    xs={7}
                    justifyContent="center"
                    alignItems="center"
                    style={{
                        background:
                            "linear-gradient(90deg, #FFA800 6.22%, #1B1B1B 94.98%)",
                        height: "100%"
                    }}
                >
                    <Image src={SecurityCheckSVG} />
                </Grid>

                <Grid
                    container
                    item
                    xs={5}
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    style={{ backgroundColor: "#1B1B1B" }}
                >
                    {userState.mmAddr ? SecurityCheckActivated() : MetamaskLogin()}

                </Grid>
            </Grid>
        </ThemeProvider>
    )
}

export default SecurityCheckPage
