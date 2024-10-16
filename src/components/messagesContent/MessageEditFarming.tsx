import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { Box, Checkbox, Text } from '@chakra-ui/react';

import { getCoinImg, getConvertedValue } from '@tools/helpers';
import { roundDown } from '@tools/round';

import { AppDispatch, useAppSelector } from '@store/store';
import { setFarmToCreate, createFarmingAction } from '@store/farmingSlice';
import { addMessage } from '@store/appSlice';

import { CoinInput } from '@components/CoinInput';
import { ButtonWrap } from '@components/ButtonWrap';

import { Currency } from '@models/common';

interface Props {
  onClose?: () => void;
}

export const MessageEditFarming: FC<Props> = ({ onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [isChecked, setIsChecked] = useState(false);
  const farming = useAppSelector((state) => state.farming);

  const earnYearValue = (Number(farming.farmToCreate?.amount) || 0) / 100 * (farming.farmToCreate?.percentage || 0);
  const formattedEarnValue = roundDown(earnYearValue/365, 3).toFixed(2);
  const contentAgreementNode = <Box mb='1rem' dangerouslySetInnerHTML={{ __html: t('pages.farming.agreementText')}}></Box>;

  useEffect(() => {
    if (!farming.farmToCreate && onClose) {
      onClose();
    }
  }, []);

  const handleCreateAction = () => {
    if (!isChecked) {
      return;
    }
    // setGiveValue('');
    dispatch(createFarmingAction({
      token: farming.farmToCreate?.token,
      amount: Number(farming.farmToCreate?.amount),
      eventSlug: farming.farmToCreate?.slug,
    }));
    dispatch(setFarmToCreate(null));
    if (onClose) {
      onClose();
    }
  }

  const handleAgreementClick = () => {
    dispatch(addMessage({
      title: t('pages.farming.agreementTitle'),
      contentNode: contentAgreementNode,
      hideButton: true,
  }));
  }

  if (!farming.farmToCreate) {
    return null;
  }

  const subvalue = getConvertedValue(
      Currency.HOOT,
      Currency.USDT,
      farming.pairPrices,
      Number(farming.farmToCreate?.amount),
  );
  const subvalueView =`${roundDown(Number(subvalue), 2).toFixed(2)} USD`;

  const handleAmountChange = (value: string) => {

    if(value && parseFloat(value) < 1) {
      dispatch(setFarmToCreate({
        ...(farming.farmToCreate || {}),
        amount: "1",
      }));
      return;
    };

    dispatch(setFarmToCreate({
      ...(farming.farmToCreate || {}),
      amount: value,
    }));
  
  };

  return (
    <Box>
      <Box>
        <CoinInput
            value={farming.farmToCreate?.amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            iconPath={getCoinImg(farming.farmToCreate.token)}
            label={t('pages.farming.youGive')}
            subvalue={subvalueView}
            isDisable={!!farming.farmToCreate.slug}
        />
      </Box>
      <Box>
        <CoinInput
            value={formattedEarnValue}
            iconPath={getCoinImg(farming.farmToCreate.token)}
            label={t('pages.farming.youEarnDaily')}
            isDisable
        />
      </Box>
      <Box>
        {t('pages.farming.farmingCoinsInfo', { coin: farming.farmToCreate.token})}
      </Box>
      <label>
        <Box display="flex">
          <Checkbox
            margin='1rem 0 0'
            isChecked={isChecked}
            onChange={(event) => setIsChecked(event.target.checked)}
          />
          <Text ml={2} padding='1.5rem 0 0.25rem'>
            {t('pages.farming.acceptAgreement')}
            {' '}
            <Text
              display='inline'
              textDecoration='underline'
              onClick={handleAgreementClick}
            >
              {t('pages.farming.agreement')}
            </Text>
          </Text>
        </Box>
      </label>
      <Box>
        <ButtonWrap
          margin='1rem auto 2rem'
          width='100%'
          display='block'
          size='md'
          onClick={handleCreateAction}
          isDisabled={!isChecked}
        >
            {t('pages.farming.runFarm')}
        </ButtonWrap>
      </Box>
    </Box>
  )
};