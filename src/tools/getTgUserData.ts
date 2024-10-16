export const getTgInitData = () => {
    // @ts-ignore
    return window?.Telegram?.WebApp?.initDataUnsafe || {};
};
