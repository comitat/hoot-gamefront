import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { getCoinImg, formatDateDigits, getCoinPercent } from '@tools/helpers';

import { AppDispatch, useAppSelector } from '@store/store';
import { getFarmingAction, setFarmToCreate, setStopFarmingId } from '@store/farmingSlice';
import { addMessage } from '@store/appSlice';
import { getAccountDataAction } from '@store/farmingSlice';

import { Box, Tabs, Tab, TabList, TabPanels, TabPanel } from "@chakra-ui/react";

import { PageTitle } from '@components/PageTitle';
import { CoinInput } from '@components/CoinInput';
import { ButtonWrap } from '@components/ButtonWrap';
import { FarmingRow } from '@components/FarmingRow';
import { MessageEditFarming } from '@components/messagesContent/MessageEditFarming';
import { SelectFarmingCoin } from '@components/messagesContent/SelectFarmingCoin';

import styles from './styles.module.scss';
import { MessageStopFarming } from '@components/messagesContent/MessageStopFarming';

export function Farming() {
    const { t } = useTranslation();
    const [farmVal, setFarmVal] = useState('');

    const farming = useAppSelector((state) => state.farming);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getFarmingAction());
    }, [])

    const activeFarms = farming.farmings?.filter(({ isActive }) => isActive) || [];
    const inactiveFarms = farming.farmings?.filter(({ isActive }) => !isActive) || [];

    const isDisabled = !farmVal || Number(farmVal) <= 0;

    const handleCreateFarminValue = (value: string) => {
        if(value && parseFloat(value) < 1) {
            setFarmVal('1');
            return;
        };
        setFarmVal(value);
    };

    const handleCreateClick = () => {
        if (isDisabled) {
            return;
        }

        dispatch(setFarmToCreate({
            amount: farmVal,
            percentage: getCoinPercent(farming.createFarmingToken),
            token: farming.createFarmingToken,
        }));
        dispatch(addMessage({
            title: t('pages.farming.confirmFarmDetails'),
            ContentComponent: MessageEditFarming,
            hideButton: true,
        }));

        setFarmVal('');
    };

    const handleStopClick = (id: string) => {
        dispatch(setStopFarmingId(id));
        dispatch(addMessage({
            title: t('pages.farming.stopFarming'),
            ContentComponent: MessageStopFarming,
            hideButton: true,
        }));

       // dispatch(stopFarmingAction(id));
    };

    useEffect(() => {
        dispatch(getAccountDataAction());
    }, []);

    return (
        <div className={styles.page}>
            <PageTitle title={t('pages.farming.farmingCenter')} />
            <Box textAlign='center' m='1rem' fontSize='1.125rem'>
                {t('pages.farming.selectCoin')} 
            </Box>
            <Box
                padding='0.5rem'
                borderRadius="block"
                backgroundColor='bg.transparent'
            >
                <CoinInput
                    value={farmVal}
                    onChange={(e) => handleCreateFarminValue(e.target.value)}
                    subtext={t('pages.farming.minInputCoin', {
                        coin: farming.createFarmingToken,
                        amount: 1,
                    })}
                    iconPath={getCoinImg(farming.createFarmingToken)}
                    label={t('pages.farming.farmToAmount')}
                    needHighlight
                    handlerCoinClick={() => {
                        dispatch(addMessage({
                            title: t('pages.farming.currency'),
                            ContentComponent: SelectFarmingCoin,
                        }));
                    }}
                />

                <ButtonWrap
                    margin='1rem 0 0'
                    width='100%'
                    size='md'
                    onClick={() => handleCreateClick()}
                    isDisabled={isDisabled}
                >
                    {t('pages.farming.farm')} 
                </ButtonWrap>
            </Box>

            <Box
                margin='1rem 0 0'
                padding='0.5rem'
                borderRadius="block"
                backgroundColor='bg.transparent'
            >

                <Tabs variant='soft-rounded' colorScheme='green'>
                    <TabList justifyContent="center">
                        <Tab
                            borderRadius='button'
                            color='aWhite'
                            flexGrow={1}
                            fontWeight='normal'
                            _selected={{
                                fontWeight: "bold",
                                backgroundColor: 'bg.tab'
                            }}
                        >
                            {t('pages.farming.activeFarms')}
                        </Tab>
                        <Tab
                            borderRadius='button'
                            color='aWhite'
                            flexGrow={1}
                            fontWeight='normal'
                            _selected={{
                                fontWeight: "bold",
                                backgroundColor: 'bg.tab',
                            }}
                        >
                            {t('pages.farming.closedFarms')}
                        </Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel padding='1rem 0 0'>
                            {!activeFarms.length && (
                                <Box padding='0.25rem'>
                                    {t('pages.farming.noFarms')}
                                </Box>
                            )}
                            <ul>
                                {activeFarms.map((farming, index) => (
                                    <li key={index}>
                                        <FarmingRow
                                            coinImg={getCoinImg(farming.token)}
                                            currencyName={farming.token}
                                            percentage={farming.percentage}
                                            farmingAmount={farming.amount}
                                            amountOriginal={farming.amountOriginal}
                                            totalAmount={farming.totalAmount}
                                            totalAmountUsdt={farming.totalAmountUsdt}
                                            dates={`${formatDateDigits(farming.startedAt)} - ${formatDateDigits(farming.startedAt)}`}
                                            handleCreateClick={() => handleCreateClick()}
                                            handleStopClick={() => handleStopClick(farming.farmId)}
                                            isActive={farming.isActive}
                                            dateStartedStr={farming.startedAt}
                                            token={farming.token}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </TabPanel>
                        <TabPanel padding='1rem 0 0'>
                            {!inactiveFarms.length && (
                                <Box padding='0.25rem'>
                                    {t('pages.farming.noFarms')}
                                </Box>
                            )}
                            <ul>
                                {inactiveFarms.map((farming, index) => (
                                    <li key={index}>
                                        <FarmingRow
                                            coinImg={getCoinImg(farming.token)}
                                            currencyName={farming.token}
                                            percentage={farming.percentage}
                                            farmingAmount={farming.amount}
                                            totalAmount={farming.totalAmount}
                                            amountOriginal={farming.amountOriginal}
                                            dates={`${formatDateDigits(farming.startedAt)} - ${formatDateDigits(farming.startedAt)}`}
                                            handleCreateClick={() => handleCreateClick()}
                                            handleStopClick={() => handleStopClick(farming.farmId)}
                                            isActive={farming.isActive}
                                            dateStartedStr={farming.startedAt}
                                            token={farming.token}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
    
            </Box>
        </div>
    );
}