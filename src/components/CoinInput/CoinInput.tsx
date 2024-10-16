import { FC } from 'react';

import { Box, Flex, Input, InputProps, Text, Image } from "@chakra-ui/react";

interface Props {
    value: InputProps['value'];
    onChange?: InputProps['onChange'];
    subtext?: string;
    info?: string;
    iconPath: string;
    label?: string;
    needHighlight?: boolean;
    editable?: boolean;
    isDisable?: boolean;
    subvalue?: string;
    handlerCoinClick?: () => void;
}

export const CoinInput: FC<Props> = ({
    value,
    subtext,
    info,
    iconPath,
    label,
    isDisable,
    onChange,
    needHighlight,
    editable = true,
    subvalue,
    handlerCoinClick,
}) => {
    const handleIconClick = ()  => {
        if (handlerCoinClick) {
            handlerCoinClick();
        }
    };

    return (
      <Box>
        <Box
            p='0.125rem'
            background={needHighlight ? 'bg.blueVioGrad' : 'bg.bodyLighter'}
            borderRadius='0.625rem'
        >
            <Flex
                align="center"
                bg="bg.bodyLighter"
                p='0 0.75rem'
                borderRadius='0.5rem'
            >
                <Box flexGrow={1}>
                    <Text fontSize="0.75rem" fontWeight="bold" mt='0.375rem' mb='-0.25rem'>
                        {label}
                    </Text>
                    <Input
                        isDisabled={isDisable}
                        type="number"
                        padding={0}
                        placeholder="0.00"
                        border="none"
                        bg="transparent"
                        color="white"
                        _focus={{
                            outline: "none",
                            boxShadow: "none",
                        }}
                        value={value}
                        outline='none'
                        onChange={onChange}
                        contentEditable={editable}
                        fontSize="1.25rem"
                    />
                    <Text fontSize="0.75rem" mt='-0.25rem' mb='0.375rem' color='neutralGray'>
                        {subvalue}
                    </Text>
                </Box>
                <Image
                    src={iconPath}
                    boxSize="32px"
                    ml={2}
                    onClick={handleIconClick}
                />
            </Flex>
      </Box>
      <Flex justify="space-between" m='0.5rem 0.875rem 0.5rem 0.875rem'>
        <Text fontSize="sm" color="gray.400">
          {subtext}
        </Text>
        <Text fontSize="sm" color="gray.400">
          {info}
        </Text>
      </Flex>
    </Box>
  )};