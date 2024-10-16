import { FC } from 'react';
import { NavLink } from 'react-router-dom';

import { HootRoutes } from '@models/routes';
import ArrowLeft from '@assets/imgs/ArrowLeft.svg';

import styles from './styles.module.scss';
import { WalletControl } from '@components/WalletControl';

interface Props {
    title: string;
}

export const SubPageTitle: FC<Props> = ({ title }) => {
 
    return (
        <header className={styles.pageTitle}>
            <NavLink to={HootRoutes.Settings} className={styles.backLabel}>
                <img className={styles.backImage} src={ArrowLeft} alt="Settings" />
                <h1 className={styles.title}>
                    {title}
                </h1>
            </NavLink>
            <WalletControl />
        </header>
    )
};