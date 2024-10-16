import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

import { Box, useToast } from '@chakra-ui/react';

import { roundDown } from '@tools/round';
import { isEnergyPositive, isEnergyEmpty } from '@tools/helpers';

// import cardImg from '@assets/imgs/video-card.png';
// import cardImgLevel2 from '@assets/imgs/video-card-2.png';
// import cardImgLevel4 from '@assets/imgs/video-card-4.png';
import miningSystemImg from '@assets/imgs/mining-system-037.png';
import BoostImg from '@assets/imgs/booster.png';

import { AppDispatch, useAppSelector } from '@store/store';
import {
    upgradeEnergyAction,
    upgradeLevelAction,
} from '@store/miningSlice';
import { addMessage } from '@store/appSlice';

// import { VerticalIndicator } from '@components/VerticalIndicator';
import { TapZone } from '@components/TapZone';
import { Automining } from '@components/Automining';
import { PageTitle } from '@components/PageTitle';
import { MessageBuyEnergy } from '@components/messagesContent/MessageBuyEnergy';
import { MessageBoostLevel } from '@components/messagesContent/MessageBoostLevel';

import { Fields } from '@models/localStorage';

import styles from './styles.module.scss';

// const hashTemp = `+0.00${uuidv4().replace(/-/g, '').substring(0, 13)}`;

const MAX_ENERGY = 10000;
const MAX_TEMPERATURE = 140;
const getBoostPrice = (level: number): number => (level - 1) * 5 + 10;

export function Mining() {
    const dispatch = useDispatch<AppDispatch>();
    const mining = useAppSelector((state) => state.mining);
    const [prevHoot, setPrevHoot] = useState(0);
    const { t } = useTranslation();
    const toast = useToast();
    const checkboxLabelUniqClass = 'checkboxLabelMiningBuyEnergy';

    const miningTemperaturePercent = (mining.temperature / MAX_TEMPERATURE) * 100;
    const miningEnergyPercent = (mining.energy / MAX_ENERGY) * 100;
    const contentEnergyNode = <MessageBuyEnergy dataLabeClasslId={checkboxLabelUniqClass} energyPrice={mining.level} level={mining.level} />;
    const contentLevelNode = (
        <MessageBoostLevel
            t={t} dataLabeClasslId={checkboxLabelUniqClass}
            boostPrice={getBoostPrice(mining.level)}
        />
    );

    useEffect(() => {
        if (
            prevHoot
            && Number(prevHoot) !== Number(mining.hoots)
            && Math.round(mining.hoots * 1000) % 200 < mining.level
        ) {
            toast({
                status: 'success',
                duration: 2000,
                position: 'top',
                render: () => (
                    <Box
                        color='neonGreen'
                        p='0.75rem 1rem'
                        bg='bg.blockSolid'
                        marginTop='2rem'
                        width='calc(100vw - 2rem)'
                        borderRadius='block'
                    >
                      {t('pages.mining.congrats')}
                    </Box>
                  ),
            });
        }
        setPrevHoot(mining.hoots);
    }, [mining.hoots, mining.level]);

    const hashTemp = useMemo(() => (
        uuidv4().substring(0, 23)
    ), [mining.hoots]);

    const handleEnergyClick = () => {
        if (localStorage.getItem(Fields.NoticeBuyEnergy)) {
            dispatch(upgradeEnergyAction(100));
        } else {
            dispatch(addMessage({
                title: t('pages.mining.boost energy'),
                contentNode: contentEnergyNode,
                actionFunc: () => {
                    dispatch(upgradeEnergyAction(100));
                    const checkboxElement = document.querySelector(`.${checkboxLabelUniqClass} input`) as HTMLInputElement;
                    localStorage.setItem(Fields.NoticeBuyEnergy, checkboxElement?.checked ? 'true' : '');
                },
                actionTitle: t('pages.mining.payXhoot', { count: mining.level }),
            }));
        }
    }

    const handleLevelupClick = () => {
        if (mining.autoMiningEnabled) {
            dispatch(addMessage({
                title: 'Autominig is active',
                message: "You can't upgrade level yet",
            }));
        } else {
            dispatch(addMessage({
                title: t('pages.mining.boost_level'),
                contentNode: contentLevelNode,
                actionFunc: () => {
                    dispatch(upgradeLevelAction());
                },
                actionTitle: t('pages.mining.payXhoot', { count: getBoostPrice(mining.level)}),
            }));
        }

    }

    return (
        <div
            className={styles.page}
        >
            <div className={styles.topWrap}>
                <PageTitle title={t('pages.mining.mining center')} />

                <div className={styles.output}>
                    <span className={styles.outputCurrency}>{roundDown(mining.hoots, 4).toFixed(3)} HOOT</span>
                    / {hashTemp}
                </div>
                <div className={styles.powerLevel}>
                    <span>Mining power <span className={styles.powerLevelVal}>{mining.level}</span></span>
                </div>
            </div>
            <div
                className={styles.main}
                style={{
                    backgroundImage: `url(${miningSystemImg})`,
                }}
            >
                <TapZone
                    classNames={styles.mainTarget}
                    isDisabled={mining.autoMiningEnabled || isEnergyEmpty(mining.energy)}
                    level={mining.level}
                    showAutoTaps={mining.autoMiningEnabled && isEnergyPositive(mining.energy)}
                    noEnergy={!isEnergyPositive(mining.energy)}
                >
                </TapZone>

                <div className={styles.subMain}>
                    <div className={styles.leftOutput} onClick={handleEnergyClick}>
                        <div
                            className={`${styles.outputSmall} ${miningEnergyPercent < 10 ? styles.outputWarning : ''}`}
                        >
                            <div className={styles.outputTextPart}>
                                <div
                                    className={styles.outputVal}
                                >
                                    {roundDown(mining.energy, 2).toFixed(2)}
                                </div>
                                <div
                                    className={styles.outputVal}
                                >
                                    <span className={styles.outputUnits}>
                                        kWtap
                                    </span>
                                    <span className={styles.microButton}>+</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.midControl}>
                        <img className={styles.midControlImage} src={BoostImg} alt='Boost' onClick={handleLevelupClick} />
                    </div>
                    <div className={styles.rightOutput}>
                        <div
                            className={`${styles.outputSmall} ${miningTemperaturePercent > 90 ? styles.outputWarning : ''} ${styles.outputSmallRight}`}
                        >
                            <span className={styles.outputTextPart}>
                                <div className={styles.outputVal}>{roundDown(mining.temperature, 1).toFixed(1)}°</div>
                                F
                            </span>
                        </div>
                    </div>
                </div>

                <Automining />
            </div>

        </div>
    );
}