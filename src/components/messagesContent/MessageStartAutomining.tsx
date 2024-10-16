import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Radio, RadioGroup } from '@chakra-ui/react';

import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '@store/store';
import {
  startAutoMiningAction,
  getMaxEarnableHootsForAutomining,
} from '@store/miningSlice';

import { ButtonWrap } from '@components/ButtonWrap';

import AutominingImg from '@assets/imgs/Automining-301.png';

const MIN_AUTOMINING_DURATION = '3';
const MID_AUTOMINING_DURATION = '6';
const MAX_AUTOMINING_DURATION = '9';

interface Props {
  onClose?: () => void;
}

export const MessageStartAutomining: FC<Props> = ({ onClose }) => {
  const { t } = useTranslation();
  const mining = useAppSelector((state) => state.mining);

  const dispatch = useDispatch<AppDispatch>();
  const [duration, setDuration] = useState(MIN_AUTOMINING_DURATION);

  const handleDoAction = () => {
      dispatch(startAutoMiningAction(Number(duration)));
      if (onClose) {
          onClose();
      }
  }

  const promo = getMaxEarnableHootsForAutomining();

  return (
    <Box>
      <Box>
        <img src={AutominingImg} style={{ margin: '0.5rem auto', height: '9rem' }} />
      </Box>
      <Box marginBottom="1rem" textAlign='center'>
        {t('pages.mining.select automining time')}
      </Box>

      <RadioGroup onChange={setDuration} value={duration}>

        <Box display="flex" marginBottom='1rem'>
            <Box paddingRight='0.5rem' marginTop='0.75rem'>
              <Radio value={MAX_AUTOMINING_DURATION} id={MAX_AUTOMINING_DURATION} />
            </Box>

            <Box width='60%'>
              <label htmlFor={MAX_AUTOMINING_DURATION}>
                <Box color="neonGreen">
                  +{promo[MAX_AUTOMINING_DURATION].toFixed(1)}
                  {' '}
                  {t('pages.mining.plus_hoots')}
                </Box>
                <Box marginBottom='0.5rem' color='neutralGray' fontSize='0.75rem'>
                  {MAX_AUTOMINING_DURATION}
                  {' '}
                  {t('pages.mining.automining_hours_duration')}</Box>
              </label>
            </Box>

            <Box color="roseRed" marginLeft="auto" marginTop='0.75rem'>
              -{Number(MAX_AUTOMINING_DURATION) * mining.level}
              {' '}
              {t('pages.mining.minus hoots')}
            </Box>
        </Box>

        <Box display="flex" marginBottom='1rem'>
            <Box paddingRight='0.5rem' marginTop='0.75rem'>
              <Radio value={MID_AUTOMINING_DURATION} id={MID_AUTOMINING_DURATION} />
            </Box>

            <Box width='60%'>
              <label htmlFor={MID_AUTOMINING_DURATION}>
                <Box color="neonGreen">
                  +{promo[MID_AUTOMINING_DURATION].toFixed(1)}
                  {' '}
                  {t('pages.mining.plus_hoots')}
                </Box>
                <Box marginBottom='0.5rem' color='neutralGray' fontSize='0.75rem'>
                  {MID_AUTOMINING_DURATION}
                  {' '}
                  {t('pages.mining.automining_hours_duration')}</Box>
              </label>
            </Box>

            <Box color="roseRed" marginLeft="auto" marginTop='0.75rem'>
              -{Number(MID_AUTOMINING_DURATION) * mining.level}
              {' '}
              {t('pages.mining.minus hoots')}
            </Box>
        </Box>

        <Box display="flex" marginBottom='1rem'>
            <Box paddingRight='0.5rem' marginTop='0.75rem'>
              <Radio value={MIN_AUTOMINING_DURATION} id={MIN_AUTOMINING_DURATION} />
            </Box>

            <Box width='60%'>
              <label htmlFor={MIN_AUTOMINING_DURATION}>
                <Box color="neonGreen">
                  +{promo[MIN_AUTOMINING_DURATION].toFixed(1)}
                  {' '}
                  {t('pages.mining.plus_hoots')}
                </Box>
                <Box marginBottom='0.5rem' color='neutralGray' fontSize='0.75rem'>
                  {MIN_AUTOMINING_DURATION}
                  {' '}
                  {t('pages.mining.automining_hours_duration')}</Box>
              </label>
            </Box>

            <Box color="roseRed" marginLeft="auto" marginTop='0.75rem'>
              -{Number(MIN_AUTOMINING_DURATION) * mining.level}
              {' '}
              {t('pages.mining.minus hoots')}
            </Box>
        </Box>
      </RadioGroup>

      <ButtonWrap
        margin='1rem auto 2rem'
        width='100%'
        display='block'
        size='md'
        onClick={handleDoAction}
      >
          {t('pages.mining.payXhoot', { count: Number(duration) * mining.level })}
      </ButtonWrap>
    </Box>
  )
};