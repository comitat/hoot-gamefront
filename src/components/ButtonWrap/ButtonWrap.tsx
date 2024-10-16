import { Button, ButtonProps } from '@chakra-ui/react';
import { FC } from 'react';

export const ButtonWrap: FC<ButtonProps> = (props) => (
    <Button
        colorScheme='blue'
        variant='solid'
        borderRadius='button'
        background='bg.blueGrad'
        fontWeight='normal'
        _hover={{
            bg: 'bg.blueGradLight',
        }}
        _focus={{
            bg: 'bg.blueTop',
        }}
        _active={{
            bg: 'bg.blueBottom',
        }}
        {...props}
    >
        {props.children}
    </Button>
);