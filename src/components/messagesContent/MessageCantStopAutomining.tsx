import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@chakra-ui/react';

import { intervalToDuration } from 'date-fns';

import { useAppSelector } from '@store/store';

import AutominingImg from '@assets/imgs/Automining-301.png';
import { getMinAutomoningTimeLasts } from '@tools/helpers';

interface Props {
  onClose?: () => void;
}

export const MessageCantStopAutomining: FC<Props> = ({ onClose }) => {
  const { t } = useTranslation();
  const mining = useAppSelector((state) => state.mining);
  const miningTimeLastsMs = getMinAutomoningTimeLasts(mining.autoMiningStart);

  const duration = intervalToDuration({ start: 0, end: miningTimeLastsMs });

  const hours = (duration.hours || 0).toString().padStart(2, '0');
  const minutes = (duration.minutes || 0).toString().padStart(2, '0');
  const seconds = (duration.seconds || 0).toString().padStart(2, '0');
  const waitingTime = `${hours}:${minutes}:${seconds}`;

  useEffect(() => {
    if (miningTimeLastsMs <= 0 && onClose) {
      onClose();
    }
  }, [miningTimeLastsMs]);

  return (
    <Box>
      <Box>
        <img src={AutominingImg} style={{ margin: '0.5rem auto', height: '9rem' }} />
      </Box>
      <Box>
        {t('pages.mining.cantStopText')}.
        <br />
        {t('pages.mining.waitingTime')}: {waitingTime}
      </Box>
    </Box>
  )
};