import "../styles/globals.css"
import Layout from "../components/layouts/main"
import "../styles/homepage.css"
import "../styles/attackCard.css"
import "../styles/attacklibrary.css"


function MyApp({ Component, router, pageProps }) {
    return (
        <Layout router={router}>
            <Component {...pageProps} />
        </Layout>
    )
}

export default MyApp
