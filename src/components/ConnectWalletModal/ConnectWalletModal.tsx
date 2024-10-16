import { FC, useEffect, useState } from 'react';

import { useAppSelector } from '@store/store';

import {
    Button,
    Flex,
    Img,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react'
import {
    isWalletInfoCurrentlyInjected,
    isWalletInfoRemote,
    WalletInfo,
    WalletInfoRemote,
} from '@tonconnect/sdk';
import { connector } from '@tools/connector';
import { QRCodeModal } from '../QRCodeModal';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const ConnectWalletModal: FC<Props> = ({ isOpen, onClose }) => {
    const [walletList, setWalletList] = useState<WalletInfo[] | null>(null);
    const [selectedWalletInfo, setSelectedWalletInfo] = useState<WalletInfoRemote | null>(null);

    const wallet = useAppSelector((state) => state.wallet);

    useEffect(() => {
        if (isOpen && wallet.walletInstance) {
            onClose();
        }
    }, [isOpen, wallet, onClose]);

    useEffect(() => {
        connector.getWallets().then(setWalletList);
    }, []);

    const onWalletClick = (walletInfo: WalletInfo) => {
        if (isWalletInfoRemote(walletInfo)) {
            return setSelectedWalletInfo(walletInfo);
        }

        if (isWalletInfoCurrentlyInjected(walletInfo)) {
            return connector.connect({
                jsBridgeKey: walletInfo.jsBridgeKey,
            });
        }

        window.open(walletInfo.aboutUrl, '_blank');
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalCloseButton backgroundColor='gray' />
                    <ModalHeader>Choose a wallet</ModalHeader>
                    <ModalBody>
                        <Flex gap={2} flexWrap={'wrap'}>
                            {walletList?.map((walletInfo) => (
                                <Button
                                    onClick={() => onWalletClick(walletInfo)}
                                    leftIcon={<Img w="16px" h="16px" src={walletInfo.imageUrl} />}
                                    key={walletInfo.name}
                                >
                                    {walletInfo.name}
                                </Button>
                            ))}
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <QRCodeModal
                isOpen={!!selectedWalletInfo}
                onClose={() => setSelectedWalletInfo(null)}
                walletInfo={selectedWalletInfo}
            />
        </>
    );
}