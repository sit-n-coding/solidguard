import { createContext, useState, useEffect } from 'react';
import { getMetamaskProvider } from './web3';
import { ethers } from "ethers"

export const UserContext = createContext({ mmAddr: null });

export const UserProvider = ({ children }) => {

    const changeMMAddr = (accounts) =>
        setUserState({ ...userState, mmAddr: accounts ? accounts[0] : null });

    useEffect(async () => {
        const mmProvider = await getMetamaskProvider({ onAccountsChange: changeMMAddr });
        const web3Provider = new ethers.providers.Web3Provider(
            mmProvider,
            ethers.providers.getNetwork("goerli"),
        );
        setProviderState({ mmProvider, web3Provider })
    }, []);
    
    const [userState, setUserState] = useState({
        mmAddr: null
    });


    const [providerState, setProviderState] = useState({
        mmProvider: null,
        web3Provider: null,
    });

    return (
        <UserContext.Provider value={[userState, setUserState, providerState]}>
            {children}
        </UserContext.Provider>
    )
}
