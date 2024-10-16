import { FC } from 'react';
import { Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import OwlImg from '@assets/imgs/owls/message-owl-012.png';

export const MessageOwlOneNoHoots: FC = () => {
  const { t } = useTranslation();
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
        borderColor='blueSharp'
        borderRadius="xl"
        padding='1.5rem 1rem'
        fontSize='1.125rem'
        fontWeight='bold'
        backgroundColor='bg.blueMessage'
        boxShadow='inset 0 0 1.75rem -0.25rem black, 0 0 1.5rem -0.25rem blue'
      >
        {t('pages.mining.boost_energy_problem')}
      </Box>
    </Box>
  );
}