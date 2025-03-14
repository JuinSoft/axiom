interface KeplrWindow extends Window {
  keplr?: {
    enable: (chainId: string) => Promise<void>;
    getOfflineSigner: (chainId: string) => {
      getAccounts: () => Promise<{ address: string; pubkey: Uint8Array }[]>;
    };
  };
}

declare global {
  interface Window extends KeplrWindow {}
}

export {}; 