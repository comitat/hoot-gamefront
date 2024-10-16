import { FC, useEffect, useState } from 'react';

import QRCode from 'react-qr-code';
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react'
import { WalletInfoRemote } from '@tonconnect/sdk';
import { connector } from '@tools/connector';


import { useAppSelector } from '@store/store';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    walletInfo: WalletInfoRemote | null;
}

export const QRCodeModal: FC<Props> = ({ isOpen, onClose, walletInfo }) => {
    const [walletConnectionURL, setWalletConnectionURL] = useState('');
    useEffect(() => {
        if (walletInfo) {
            setWalletConnectionURL(connector.connect({
                bridgeUrl: walletInfo.bridgeUrl,
                universalLink: walletInfo.universalLink, // universalLink
            }));
        }
    }, [walletInfo]);


    const wallet = useAppSelector((state) => state.wallet);

    useEffect(() => {
        if (isOpen && wallet.walletInstance) {
            onClose();
        }
    }, [isOpen, wallet, onClose]);

    // console.log(' >> walletConnectionURL: ', walletConnectionURL);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalCloseButton />
                <ModalHeader>Connect to {walletInfo?.name}</ModalHeader>
                <ModalBody display="flex" flexDirection="column" alignItems="center">
                    <QRCode value={walletConnectionURL} />
                    <Button
                        w="100%"
                        my="4"
                        onClick={() => {
                            window.open(walletConnectionURL, '_blank');
                        }}
                    >
                        Open {walletInfo?.name}
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}