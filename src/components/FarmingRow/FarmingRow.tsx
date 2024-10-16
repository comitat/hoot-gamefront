import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// import ArrowRenewImg from '@assets/imgs/ArrowRenew.svg';

import { ButtonWrap } from '@components/ButtonWrap';
// import { roundDown } from '@tools/round';
import { Currency } from '@models/common';

import { useAppSelector } from '@store/store';
import { getConvertedValue } from '@tools/helpers';
import { getIncreaseAmont } from '@tools/helpers';
import { getFormattedDate, getFormattedTime } from '@tools/helpers';

import styles from './styles.module.scss';

interface Props {
    coinImg: string;
    currencyName: string;
    percentage: number;
    totalAmount: number;
    farmingAmount: string;
    amountOriginal?: string;
    totalAmountUsdt?: number;
    dates: string;
    handleCreateClick: () => void;
    handleStopClick: () => void;
    isActive: boolean;
    dateStartedStr: string;
    token: Currency;
}

export const FarmingRow: FC<Props> = ({
    coinImg,
    // currencyName,
    percentage,
    //farmingAmount,
    //amountOriginal,
    dates,
    totalAmount,
    totalAmountUsdt,
    dateStartedStr,
    // handleCreateClick,
    handleStopClick,
    isActive,
    token,
}) => {
    const { t } = useTranslation();
    const [increasedAmount, setIncreasedAmount] = useState(0);

    const farming = useAppSelector((state) => state.farming);
    const amountOriginalInUsdt = getConvertedValue(
        token,
        Currency.USDT,
        farming.pairPrices,
        Number(totalAmountUsdt),
    );
    // const yearBalancePercent = farmingAmount
    //     ? Number(farmingAmount) / 100 * percentage
    //     : null;

    // const balancePercentView = farmingAmount // covertedBalance
    //     ? `+$${roundDown(Number(yearBalancePercent) / 365, 2).toFixed(2)}` // covertedBalance
    //     : null;

    // const increasedAmountView = `+$${roundDown(increasedAmount, 2).toFixed(2)}`
    //     || balancePercentView;

    useEffect(() => {
        const intervalId = setInterval(() => {
            const secondsPassed = new Date().valueOf() - new Date(dateStartedStr).valueOf();
            setIncreasedAmount(getIncreaseAmont(Number(amountOriginalInUsdt), secondsPassed/1000, percentage));
        }, 500);
    
        return () => clearInterval(intervalId);
      }, []);

    return (
        <div className={styles.balanceItem}>
            <img className={styles.iconCoin} src={coinImg} />
            <div className={styles.currency}>
                <div className={styles.currencyVal}>
                    {getFormattedDate(dateStartedStr)}
                </div>
                <div className={styles.eqValue}>{getFormattedTime(dateStartedStr)}</div>
            </div>
            <div className={styles.balanceValueConvert}>
                {/* {balanceValueConverted
                    ? `$${roundDown(balanceValueConverted).toFixed(2)}`
                    : '-'
                } */}
                {/* ${amountOriginal} ({isActive ? ' in usd ': ("in " + token)}) */}
                {isActive ? "$" + totalAmountUsdt?.toFixed(2) : totalAmount}
                <br />
                {isActive ? (
                    <span className={styles.subValue}>
                        +${increasedAmount.toFixed(3)}
                        <span className={styles.incomeComment}>
                            {t('pages.farming.currentIncome')}
                        </span>
                    </span>
                ) : (
                    <span className={styles.eqValue}>
                        {dates}
                    </span>
                )}
            </div>
            {isActive ? (
                <ButtonWrap
                    margin='0'
                    size='md'
                    onClick={handleStopClick}
                >
                    Stop
                </ButtonWrap>
            )
            : null
            // (
            //     <ButtonWrap
            //         margin='0'
            //         size='md'
            //         onClick={handleEditClick}
            //     >
            //         <img className={styles.iconInButton} src={ArrowRenewImg} />
            //     </ButtonWrap>
            // )
            }

        </div>
    );
}