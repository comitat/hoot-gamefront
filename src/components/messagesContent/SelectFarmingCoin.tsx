import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { Box, Image, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';


import { AppDispatch, useAppSelector } from '@store/store';
import { setCreateFarmingToken } from '@store/farmingSlice';


import { Currency } from '@models/common';
import { getCoinImg, getCoinPercent } from '@tools/helpers';

interface Props {
  onClose?: () => void;
}

export const SelectFarmingCoin: FC<Props> = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const farming = useAppSelector((state) => state.farming);

  const selectCoin = (value: Currency) => {

    dispatch(setCreateFarmingToken(value));
  }

  return (
    <Box>
      <Box margin="0.25rem 0 0.5rem">
        {t('pages.farming.selectCurrency')}
      </Box>

      <RadioGroup  onChange={selectCoin} value={farming.createFarmingToken}>
        <Stack>

          {[Currency.TON, Currency.HOOT].map((coinToken) => (
            <Radio
              value={coinToken}
              padding="0.25rem 0"
            >
              <Box
                width="calc(100vw - 2rem - 2rem )"////////////////
                display="flex">
                <Text
                  fontSize="1rem"
                  flexGrow="1"
                  lineHeight="2.2rem"
                >
                  {t('pages.farming.selectTextToken', {
                    percent: getCoinPercent(coinToken),
                    coin: coinToken,
                  })}
                </Text>
                <Image
                  src={getCoinImg(coinToken)}
                  boxSize="32px"
                  display="inline-block"
                  ml={2}
                />
              </Box>
            </Radio>
          ))}

        </Stack>
      </RadioGroup>

    </Box>
  )
};