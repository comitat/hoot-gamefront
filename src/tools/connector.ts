import TonConnect from '@tonconnect/sdk';

export const connector = new TonConnect(
    {
    manifestUrl: import.meta.env.VITE_APP_URL + '/tonconnect-manifest.json',
});

connector.restoreConnection();