import { FC } from 'react';
import { Box } from '@chakra-ui/react';

import BoostImg from '@assets/imgs/boost-701.png';

interface Props {
    t: (key: string) => string;
    dataLabeClasslId: string;
    boostPrice: number;
}

export const MessageBoostLevel: FC<Props> = ({ t, boostPrice }) => {

  const cost = `-${boostPrice.toFixed(1)}`;

  return (
    <Box>
      <img src={BoostImg} style={{ margin: '0.5rem auto', height: '7rem' }} />

      <Box display="flex" marginBottom="0.25rem">
        <Box width='60%'>
          <Box color="neonGreen" marginBottom='0.5rem'>
            {t('pages.mining.plus_level')}
          </Box>
          <Box>{t('pages.mining.plus_level_bonus1')}</Box>
          <Box>{t('pages.mining.plus_level_bonus2')}</Box>
        </Box>
        <Box color="roseRed" marginLeft="auto">
          {cost}
          {' '}
          {t('pages.mining.minus hoots')}
        </Box>
      </Box>
    </Box>
  );
}