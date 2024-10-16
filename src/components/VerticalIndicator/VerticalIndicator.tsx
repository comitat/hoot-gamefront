import { FC } from 'react';
import styles from './styles.module.scss';

interface Props {
    value: number;
    exhaustible?: boolean;
    clickHandler?: () => void; 
}

export const VerticalIndicator: FC<Props> = ({ value, exhaustible = false, clickHandler }) => {
    let colorClass = '';
    let percentToCompare = exhaustible
        ? 100 - value
        : value;

    switch (true) {
        case percentToCompare > 90:
            colorClass = styles.red;
            break;
        case percentToCompare > 70:
            colorClass = styles.violet;
            break;
        case percentToCompare > 40:
            colorClass = styles.blue;
            break;
        default:
            colorClass = styles.green;
    }

    const handleClick = () => {
        if (clickHandler) {
            clickHandler();
        };
    };

    return (
        <div className={styles.indicatorWrap} onClick={handleClick}>
            <div
                style={{ height: `${value}%`}}
                className={`${styles.indicator} ${colorClass}`}
            />
        </div>
    );
};