import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Checkbox, Text } from '@chakra-ui/react';

import { useDispatch } from 'react-redux';
import { AppDispatch } from '@store/store';
import {
    stopAutoMiningAction,
} from '@store/miningSlice';

import { ButtonWrap } from '@components/ButtonWrap';

interface Props {
  onClose?: () => void;
}

export const MessageStopAutomining: FC<Props> = ({ onClose }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch<AppDispatch>();
  const [isChecked, setIsChecked] = useState(false);
  const handleDoAction = () => {
    if (isChecked) {
        dispatch(stopAutoMiningAction());
        if (onClose) {
            onClose();
        }
    }
  }
  return (
    <Box>
      <Box marginBottom="1rem">
        {t('pages.mining.stop not refund')}
      </Box>
      <label>
        <Box display="flex">
          <Checkbox isChecked={isChecked} onChange={(event) => setIsChecked(event.target.checked)}/>
          <Text ml={2}>{t('pages.mining.stop accept and agree')}</Text>
        </Box>
      </label>
      <ButtonWrap
        margin='1rem 1rem 2rem'
        size='md'
        onClick={handleDoAction}
        isDisabled={!isChecked}
      >
          {t('pages.mining.stop accept and agree')}
      </ButtonWrap>
    </Box>
  )
};