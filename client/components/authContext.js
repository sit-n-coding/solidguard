import { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const AuthContext = createContext({ userId: null, role: null });

export const AuthProvider = ({ children }) => {

    const getAuthState = () => {
        return { userId: Cookies.get('userId'), role: Cookies.get('role') }
    }

    const [authState, setAuthState] = useState({ userId: null, role: null });

    const updateAuthState = () => {
        setAuthState(getAuthState());
    }

    useEffect(() => {
        setAuthState(getAuthState())
    },[]);

    return (
        <AuthContext.Provider value={[authState, updateAuthState]}>
            {children}
        </AuthContext.Provider>
    )
}
