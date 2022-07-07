import {
    Autocomplete,
    Button,
    Grid,
    IconButton,
    InputLabel,
    Input,
    Typography
} from "@mui/material"
import Colors from "../styles/colors"
import * as React from "react"
import TextField from "@mui/material/TextField"
import SecurityCheckSVG from "../styles/securityCheckGraphic.svg"
import Image from "next/image"
import { useState, useContext } from "react"
import Link from "next/link"
import { createTheme, ThemeProvider, styled } from "@mui/material/styles"
import theme from "../styles/theme.js"
import { FormControl } from "@mui/material"
import FormHelperText from "@mui/material/FormHelperText"
import { PinDropSharp } from "@material-ui/icons"
import { fetchAPI } from "../components/fetchAPI"
import { AuthContext } from '../components/authContext'

let signInBody = {}

const SignInField = (props) => {
    return (
        <div style={{ width: "100%" }}>
            <Typography variant="h6" align="left" color={Colors.textLight}>
                * {props.field}
            </Typography>
            <TextField
                id="filled-basic"
                variant="filled"
                style={{
                    margin: "10px 0 10% 0",
                    backgroundColor: Colors[5],
                    borderRadius: "10px",
                    width: "100%"
                }}
                onChange={(e) => {
                    signInBody[props.label] = e.target.value
                }}
            />
        </div>
    )
}

const SignInPage = () => {
    const signIn = async () => {
        console.log(signInBody)
        const response = await fetchAPI(`
        mutation login($input: LoginRequestDto!) {
            login(loginRequest: $input)
        }
        `, {
            input: {
                name: signInBody['name'],
                password: signInBody['password']
            }
        })

        if (!response.errors) {
            alert("authorized")
        } else {
            alert("unauthorized")
        }
        updateAuthState()
    }

    const [authState, updateAuthState] = React.useContext(AuthContext);

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
                            "linear-gradient(90deg, #FFA800 6.22%, #003748 94.98%)",
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
                    alignItems="center"
                    style={{ background: Colors[4], padding: "8% 8% 0 8%" }}
                >
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start"
                        }}
                    >
                        <Typography
                            variant="h2"
                            align="left"
                            color={Colors.textLight}
                            style={{ marginBottom: "12%" }}
                        >
                            <b>SIGN IN</b>
                        </Typography>

                        <SignInField field="Username" label="name" />
                        <SignInField field="Password" label="password" />
                        <Button
                            variant="contained"
                            onClick={() => signIn()}
                        >
                            Sign In
                        </Button>
                        <Typography
                            variant="body1"
                            style={{ marginTop: "20px" }}
                            align="left"
                            color={Colors.textLight}
                        >
                            New user?{" "}
                            <Link href={"/register"} passHref>
                                [SIGN UP]
                            </Link>
                        </Typography>
                    </div>
                </Grid>
            </Grid>
        </ThemeProvider>
    )
}

export default SignInPage
