import detectEthereumProvider from "@metamask/detect-provider";

export const getMetamaskProvider = async ({onChainChange, onAccountsChange}) => {
    const mmProvider = await detectEthereumProvider({ mustBeMetaMask: true });
    if (onChainChange) {
        mmProvider.on("chainChanged", onChainChange);
    }
    if (onAccountsChange) {
        mmProvider.on("accountsChanged", onAccountsChange);
    }
    return mmProvider;
};

export const destroyMetamaskProvider = async(onChainChange, onAccountsChange) => {
    if (onChainChange) {
        mmProvider.removeListener("chainChanged", onChainChange);
    }
    if (onAccountsChange) {
        mmProvider.removeListener("accountsChanged", onAccountsChange);
    }
}

export const getMetamaskAccounts = async (mmProvider) => {
    return mmProvider.request({ method: 'eth_requestAccounts' });
}
