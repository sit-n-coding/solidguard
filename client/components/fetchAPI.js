export const fetchAPI = async (input, init) => {
    if (process.env.NEXT_PUBLIC_API_HOST){
        return fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api${input}`, {
            ...(init ? init : {}),
            headers: {
                ...(init? init.headers : {}),
            },
            credentials: "include"
        });
    }
    return fetch(`/api${input}`, {
        ...init,
    });
}