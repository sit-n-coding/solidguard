import "../styles/globals.css"
import Layout from "../components/layouts/main"
import "../styles/homepage.css"
import "../styles/attackCard.css"
import "../styles/attacklibrary.css"
import '../styles/error.css';
import { UserProvider } from "../components/userContext"
import { AuthProvider } from "../components/authContext"

function MyApp({ Component, router, pageProps }) {
    return (
        <AuthProvider>
            <UserProvider>
                <Layout router={router}>
                    <Component {...pageProps} />
                </Layout>
            </UserProvider>
        </AuthProvider>
    )
}

export default MyApp
