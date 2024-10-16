import { useTranslation } from 'react-i18next';

import { PageTitle } from '@components/PageTitle';
import { Box, ButtonGroup, Text } from '@chakra-ui/react';

import { ButtonWrap } from '@components/ButtonWrap';
import { BalanceRow } from '@components/BalanceRow';

import hootImg from '@assets/imgs/coins/hoot.png';
import usdtImg from '@assets/imgs/coins/usdt.png';
import usdImg from '@assets/imgs/coins/usd.png';
import tonImg from '@assets/imgs/coins/ton.png';
import DepositImg from '@assets/imgs/small/Deposit.svg';
import WithdrawImg from '@assets/imgs/small/Withdraw.svg';
import SwapImg from '@assets/imgs/small/Swap.svg';
import ArrowBtn from '@assets/imgs/ArrowBtn.svg';

import styles from './styles.module.scss';

export function Cash() {
    const { t } = useTranslation();

    return (
        <div className={styles.page}>
            <PageTitle title={t('pages.cash.cash center')} />

            <div className={styles.gradientBorderBlock}>
                <div className={styles.gradientBorderContent}>
                    <h3 className={styles.bTitle}>{t('pages.cash.balance in game')}</h3>
                    
                    <ul>
                        <li>
                            <BalanceRow
                                coinImg={usdtImg}
                                currencyName='USDT'
                                eqValue={0.02}
                                balanceValue={0.000}
                            />
                        </li>

                        <li>
                            <BalanceRow
                                coinImg={hootImg}
                                currencyName='HOOT'
                                eqValue={0.05}
                                balanceValue={0.000}
                            />
                        </li>

                        <li>
                            <BalanceRow
                                coinImg={tonImg}
                                currencyName='TON'
                                eqValue={0.03}
                                balanceValue={0.000}
                            />
                        </li>
                    </ul>
                    
                    <ButtonGroup 
                        margin='0.375rem'
                        display='flex'
                    >
                        <ButtonWrap
                            flexGrow='1'
                            size='sm'
                            isDisabled
                            width='33%'
                            leftIcon={<img className={styles.buttonIco} src={DepositImg} />}
                        >
                            {t('pages.cash.deposit')}
                        </ButtonWrap>

                        <ButtonWrap
                            flexGrow='1'
                            size='sm'
                            width='33%'
                            leftIcon={<img className={styles.buttonIco} src={WithdrawImg} />}
                        >
                            {t('pages.cash.withdraw')}
                        </ButtonWrap>

                        <ButtonWrap
                            flexGrow='1'
                            size='sm'
                            width='33%'
                            leftIcon={<img className={styles.buttonIco} src={SwapImg} />}
                        >
                            {t('pages.cash.swap')}
                        </ButtonWrap>
                    </ButtonGroup>
                </div>
            </div>
            
            <div className={`${styles.gradientBorderBlock} ${styles.gradientBlue}`}>
                <div className={styles.gradientBorderContent}>
                    <h3 className={styles.bTitle}>{t('pages.cash.farming balance')}</h3>
                    <ul>
                        <li>
                            <BalanceRow
                                coinImg={usdImg}
                                currencyName='USD'
                                eqValue={0.02}
                                balanceValue={0.000}
                            />
                        </li>
                    </ul>
                </div>
            </div>

            <ButtonWrap
                margin='1rem 0 0'
                width='100%'
                size='md'
            >
                Button
            </ButtonWrap>

            <Box
                bg="bg.block"
                borderRadius="block"
                margin='1rem 0'
                padding='0.25rem 0.75rem 0.5rem'
                display='flex'
            >
                <Box>
                    <h3 className={styles.bsTitle}>{t('pages.cash.wallet address')}</h3>
                    <Box fontSize='0.75rem' color='lightGrey'>
                        df34c...43f5a
                    </Box>
                </Box>
                <Box marginLeft='auto'>
                    <ButtonWrap
                        margin='0.5rem 0 0'
                        size='sm'
                    >
                        {t('pages.cash.wallet disconnect')}
                    </ButtonWrap>
                </Box>
            </Box>

            <Box
                bg="bg.block"
                borderRadius="block"
                margin='1rem 0'
                padding='0.25rem 0.5rem 0.5rem 0.75rem;'
                display='flex'
            >
                <Box>
                    <h3 className={styles.bsTitle}>{t('pages.cash.transaction history')}</h3>
                    <Box fontSize='0.625rem' display='flex' marginTop='0.25rem' fontWeight='bold'>
                        <Text background='bg.transparentLight' marginRight='0.5rem' borderRadius='large' padding='0.125rem 0.5rem'>
                            20.0 in
                        </Text>
                        <Text background='bg.transparentLight' marginRight='0.5rem' borderRadius='large' padding='0.125rem 0.5rem' color='roseRed'>
                            15.0 out
                        </Text>
                        <Text background='bg.transparentLight' marginRight='0.5rem' borderRadius='large' padding='0.125rem 0.5rem' color='neonGreen'>
                            5.0 debet
                        </Text>
                    </Box>
                </Box>
                <Box marginLeft='auto' marginTop='0.5rem'>
                    <img className={`${styles.buttonArr} ${styles.buttonUp}`} src={ArrowBtn} />
                </Box>
            </Box>
        </div>
    );
}