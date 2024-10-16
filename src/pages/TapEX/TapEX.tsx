
import { PageTitle } from '@components/PageTitle';
import tapexTempImg from '@assets/imgs/tapexTemp.png';

import styles from './styles.module.scss';
import { Box } from '@chakra-ui/react';

export function TapEX() {
    return (
        <div className={styles.page}
            style={{
                backgroundImage: `url(${tapexTempImg})`,
            }}
        >
            <PageTitle title='TapEX center' />
            <Box
                fontSize='2rem'
                textAlign='center'
                height='100%'
                backgroundColor='bg.bodyTransparent'
                lineHeight='80vh'
            >
                Coming soon
            </Box>
        </div>
    );
}