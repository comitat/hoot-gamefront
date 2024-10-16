import { FC } from 'react';
import { Box, Checkbox, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import EnergyImg from '@assets/imgs/energy-002.png';

interface Props {
    dataLabeClasslId: string;
    energyPrice: number;
    level: number;
}

export const MessageBuyEnergy: FC<Props> = ({ dataLabeClasslId, energyPrice, level }) => {

  const { t } = useTranslation();
  const cost = `-${energyPrice.toFixed(1)}`;

  return (
    <Box>
      <img src={EnergyImg} style={{ margin: '0.5rem auto', height: '6.5rem' }} />

      <Box display="flex" marginBottom="1rem">
        <Box color="neonGreen">
          {t('pages.mining.plus_energy', { count: level * 100 })}
        </Box>
        <Box color="roseRed" marginLeft="auto">
          {cost}
          {' '}
          {t('pages.mining.minus hoots')}
        </Box>
      </Box>
      <label>
        <Box display="flex">
          <Checkbox className={dataLabeClasslId} />
          <Text ml={2}>{t('pages.mining.dont show')}</Text>
        </Box>
      </label>
    </Box>
  );
}