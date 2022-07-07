export const fetchAPI = async (query, variables) => {
    const params = {
        method: "POST",
        body: JSON.stringify({
            query,
            variables
        }),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        credentials: "include",
    }
    let res = null;
    if (process.env.NEXT_PUBLIC_API_HOST){
        res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/graphql`, params);
    } else {
        res = await fetch(`/graphql`, params);
    }
    const data = await res.json()
    return data;
}