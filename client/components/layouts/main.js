import Head from "next/head"
import Navbar from "../navbar"
import Footer from "../footer"
import { Container } from "@mui/material"


export default function Main({ children, router }) {
    return (
        <div>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <title>SolidGuard</title>
            </Head>
            <Navbar path={router.asPath} />

            <div>{children}</div>
            <Footer path={router.asPath} />
        </div>
    )
}
