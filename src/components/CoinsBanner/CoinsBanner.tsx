import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { HootRoutes } from '@models/routes';
import { Currency } from '@models/common';

import { AppDispatch, useAppSelector } from '@store/store';
import { getAccountDataAction, getFarmingAction } from '@store/farmingSlice';

import { getConvertedValue, getHourPercentage } from '@tools/helpers';
import { roundDown } from '@tools/round';

import styles from './styles.module.scss';

export const CoinsBanner: FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const mining = useAppSelector((state) => state.mining);
    const farming = useAppSelector((state) => state.farming);

    const balanceConverted = getConvertedValue(
        Currency.HOOT,
        Currency.USDT,
        farming.pairPrices,
        Number(mining.hoots),
    );

    const balanceTon = mining.ton;

    const activeFarms = farming.farmings?.filter(({ isActive }) => isActive) || [];
    const farmingTotal = activeFarms.reduce(
        (accum, farm) => accum + Number(farm.totalAmountUsdt),
        0,
    );

    const hourPercentTotal = activeFarms.reduce(
        (accum, farm) => accum + getHourPercentage(Number(farm.totalAmountUsdt), farm.percentage),
        0,
    );

    const hourPercentTotalView = Math.max(hourPercentTotal, 0.01);

    useEffect(() => {
        dispatch(getFarmingAction());
        dispatch(getAccountDataAction());
    }, []);
    
    return (
        <NavLink to={HootRoutes.Cash} className={styles.banner}>

            <div className={styles.coinWidget}>
                <div className={styles.amount}>
                    ${roundDown(balanceConverted || 0, 2).toFixed(2)}
                </div>
                <div className={styles.part}>
                    <div className={styles.label}>On master</div>
                    <span className={styles.value}>
                        <span className={styles.digits}>
                            {roundDown(balanceTon || 0, 2).toFixed(2)}
                        </span> TON
                    </span>
                </div>
            </div>

            <div className={`${styles.coinWidget} ${styles.blueGradient}`}>
                <div className={styles.amount}>
                    ${roundDown(farmingTotal || 0, 2).toFixed(2)}
                </div>
                <div className={styles.part}>
                    <div className={styles.label}>On farming</div>
                    <span className={`${styles.value} ${styles.positive}`}>
                        <span className={styles.digits}>
                            ${roundDown(hourPercentTotalView, 2).toFixed(2)}
                        </span>/hour
                    </span>
                </div>
            </div>

        </NavLink>
    );
}