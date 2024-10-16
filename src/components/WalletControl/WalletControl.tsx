import { FC, useState, useEffect} from 'react';

import { useDispatch } from 'react-redux';

import {
    Menu,
    MenuButton,
    Button,
    MenuItem,
    MenuList,
    useClipboard,
} from '@chakra-ui/react';

import { CHAIN, toUserFriendlyAddress } from '@tonconnect/sdk';

import { connector } from '@tools/connector';

import WalletAdd from '@assets/imgs/WalletAdd.svg';
import Wallet from '@assets/imgs/Wallet.svg';

import { setWallet } from '@store/walletSlice';
import { AppDispatch, useAppSelector } from '@store/store';

import { ConnectWalletModal } from '@components/ConnectWalletModal';

import styles from './styles.module.scss';

export const WalletControl: FC = () => {
    const [isConnectOpen, setIsConnectOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const unsubscribe = connector.onStatusChange((w) => {
            console.log(' >> wallet set: ', w);
            dispatch(setWallet(w));
        });
        return unsubscribe;
    }, []);

    const { walletInstance } = useAppSelector((state) => state.wallet);

    const userFriendlyAddress = walletInstance && walletInstance.account?.address
        ? toUserFriendlyAddress(walletInstance.account.address, walletInstance.account?.chain === CHAIN.TESTNET)
        : '';
    const slicedUserFriendlyAddress = userFriendlyAddress
      ? userFriendlyAddress.slice(0, 4) + '…' + userFriendlyAddress.slice(-4)
      : userFriendlyAddress;
    const { onCopy, hasCopied } = useClipboard(userFriendlyAddress);

    const onConnectClose = () => {
        setIsConnectOpen(false);
    }
    const onWalletConnect = () => {
        setIsConnectOpen(true);
    };

    return (
        <>
            <div className={styles.wallet}>
                {!!walletInstance ? (
                    <Menu>
                    <MenuButton
                        as={Button}
                        background='transparent'
                        margin={0}
                        padding={0}
                    >
                        <img className={styles.iconImage} src={Wallet} alt={slicedUserFriendlyAddress} />
                    </MenuButton>
                    <MenuList backgroundColor='black'>
                        <MenuItem onClick={onCopy} closeOnSelect={false}  backgroundColor='darkgray'>
                        {hasCopied ? 'Copied' : 'Copy address'}
                        </MenuItem>
                        <MenuItem onClick={() => connector.disconnect()}>Disconnect</MenuItem>
                    </MenuList>
                    </Menu>
                ) : (
                    <img
                        onClick={onWalletConnect}
                        className={styles.iconImage}
                        src={WalletAdd}
                        alt="Add Wallet"
                    />
                )}
            </div>

            <ConnectWalletModal isOpen={isConnectOpen} onClose={onConnectClose} />
        </>
    );
};