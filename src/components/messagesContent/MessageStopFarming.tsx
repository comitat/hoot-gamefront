import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { Box, Checkbox, Text } from '@chakra-ui/react';

import { getCoinImg, getMinusTax, getWeekPercentageProfit } from '@tools/helpers';

import { AppDispatch, useAppSelector } from '@store/store';
import { stopFarmingAction } from '@store/farmingSlice';

import { CoinInput } from '@components/CoinInput';
import { ButtonWrap } from '@components/ButtonWrap';

import { Currency } from '@models/common';

interface Props {
  onClose?: () => void;
}

const taxPersentage = 2;

export const MessageStopFarming: FC<Props> = ({ onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [isChecked, setIsChecked] = useState(false);
  const farming = useAppSelector((state) => state.farming);

  const farmToStop = useMemo(() => {
    return farming.farmings.find((farm) => farm.farmId === farming.farmToStopId);
  }, [farming.farmings, farming.farmToStopId]);

  const getValueMoneyOnNextWeek = (amount: number, percentage: number) => {
    let weekAmount = (amount + getWeekPercentageProfit(amount, percentage))
    return weekAmount.toFixed(2)
  }

  useEffect(() => {
    if (!farmToStop && onClose) {
      onClose();
    }
  }, [farmToStop, onClose]);

  if (!farmToStop) {
    return null;
  }

  const handleCreateAction = () => {
    dispatch(stopFarmingAction(farmToStop.farmId));
    if (onClose) {
      onClose();
    }
  };


  return (
    <Box>
      <Box>
        <CoinInput
            value={getValueMoneyOnNextWeek(farmToStop.totalAmountUsdt, farmToStop.percentage)}
            iconPath={getCoinImg(Currency.USD)}
            label={t('pages.farming.amountNexWeek')}
            isDisable={true}
        />
      </Box>
      <Box>
        <CoinInput
            value={farmToStop.totalAmountUsdt.toFixed(2)}
            iconPath={getCoinImg(Currency.USD)}
            label={t('pages.farming.amountToday')}
            isDisable={true}
        />
      </Box>
       <Text ml={2}>
          {t('pages.farming.commission', {persentage: taxPersentage})}
        </Text>
      <Box>
        <CoinInput
            value={getMinusTax(farmToStop.totalAmountUsdt, taxPersentage)}
            iconPath={getCoinImg(Currency.USD)}
            label={t('pages.farming.amountCommission')}
            isDisable={true}
        />
      </Box>
      <label>
        <Box display="flex">
          <Checkbox
            margin='1rem 0 0'
            isChecked={isChecked}
            onChange={(event) => setIsChecked(event.target.checked)}
          />
          <Text ml={2} padding='1rem 0 0.25rem'>
            {t('pages.farming.agreeStopFarming')}
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