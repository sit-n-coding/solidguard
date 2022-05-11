module.exports = {
    reactStrictMode: true,
    experimental: {
        outputStandalone: true,
    },
    env: {
        NEXT_PUBLIC_API_HOST: process.env.NEXT_PUBLIC_API_HOST,
    }
}
