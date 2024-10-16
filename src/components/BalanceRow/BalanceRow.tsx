import { FC } from 'react';
import styles from './styles.module.scss';

interface Props {
    coinImg: string;
    currencyName: string;
    eqValue: number;
    balanceValue: number;
}

export const BalanceRow: FC<Props> = ({ coinImg, currencyName, eqValue, balanceValue }) => (
    <div className={styles.balanceItem}>
        <img className={styles.iconCoin} src={coinImg} />
        <div className={styles.currency}>
            <div className={styles.currencyName}>{currencyName}</div>
            <div className={styles.eqValue}>{eqValue}$</div>
        </div>
        <div className={styles.balanceValue}>
            {balanceValue}
        </div>
    </div>
);