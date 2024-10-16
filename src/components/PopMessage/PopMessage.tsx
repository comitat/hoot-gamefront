import { FC, ReactNode } from 'react';

import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react';

import { ButtonWrap } from '@components/ButtonWrap';

interface ChildProps {
    onClose?: () => void;
}

interface Props {
    isOpen?: boolean;
    onClose: () => void;
    contentNode?: ReactNode;
    text?: string;
    title?: string;
    actionFunc?: () => void;
    actionTitle?: string;
    hideButton?: boolean;
    ContentComponent?: FC<ChildProps>;
}

export const PopMessage: FC<Props> = ({
    isOpen = true,
    onClose,
    contentNode,
    text,
    title,
    actionFunc,
    actionTitle,
    hideButton = false,
    ContentComponent,
}) => {

    const fooo = () => {};
    const handleDoAction = () => {
        if (actionFunc) {
            actionFunc();
        }
        onClose();
    }

    return (
        <Modal
            isOpen={isOpen} onClose={onClose || fooo}
        >
            <ModalOverlay/>
            <ModalContent
                bg='bg.body'
                margin='auto 0 0'
                borderColor='#9f97bb'
                borderStyle='solid'
                borderWidth='1px'
                borderRadius='1rem 1rem 0 0'
                boxShadow='0 0 9rem -0.5rem #5448DF'
            >
                <ModalCloseButton
                    bg='bg.transparent'
                    margin='0.25rem 0.125rem'
                    size='sm'
                    fontSize="xs"
                />
                <ModalHeader
                    textAlign='center'
                    fontSize='1rem'
                    fontWeight='bold'
                >
                    {title || 'Error'}
                </ModalHeader>
                <ModalBody
                    paddingTop='0'
                    paddingLeft='1rem'
                    paddingRight='1rem'
                    fontSize='0.875rem'
                >
                    {ContentComponent
                        ? <ContentComponent onClose={onClose} />
                        : (text || contentNode)}
                </ModalBody>
                {!hideButton && (
                    <ButtonWrap
                        margin='1rem 1rem 2rem'
                        size='md'
                        onClick={handleDoAction}
                    >
                        {actionTitle || 'Ok'}
                    </ButtonWrap>
                )}
            </ModalContent>
        </Modal>
    );
}