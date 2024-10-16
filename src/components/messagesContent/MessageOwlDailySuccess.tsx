import { FC } from 'react';
import { Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '@store/store';

import OwlImg from '@assets/imgs/owls/message-owl-success.png';

export const MessageOwlDailySuccess: FC = () => {
  const { t } = useTranslation();
  const events = useAppSelector((state) => state.events);

  return (
    <Box>
      <Box
        height='8.325rem'
        overflow='hidden'
      >
        <img src={OwlImg} style={{ margin: '0.5rem auto 0', height: '9rem' }} />
      </Box>

      <Box
        border='1px solid'
        display="flex"
        flexDirection="column"
        alignItems="center"
        borderColor='blueSharp'
        borderRadius="xl"
        padding='1.5rem 1rem'
        fontSize='1.125rem'
        fontWeight='bold'
        backgroundColor='bg.blueMessage'
        boxShadow='inset 0 0 1.75rem -0.25rem black, 0 0 1.5rem -0.25rem blue'
      >
        {t('pages.events.dailySuccessMessage')}
        <Box color="#FAC743">+ {events.dailyBonusEnergy} kWt</Box>
      </Box>
    </Box>
  );
}