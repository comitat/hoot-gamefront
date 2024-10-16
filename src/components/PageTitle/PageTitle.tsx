import { FC } from 'react';
import { NavLink } from 'react-router-dom';

import { HootRoutes } from '@models/routes';
import SettingsIco from '@assets/imgs/Settings.svg'; 

import { WalletControl } from '@components/WalletControl';
import { CoinsBanner } from '@components/CoinsBanner';

import styles from './styles.module.scss';

interface Props {
    title: string;
    showBanner?: boolean;
    className?: string;
}

export const PageTitle: FC<Props> = ({ title, showBanner = true, className }) => {

    return (
        <>
            <header className={styles.pageTitle + (className ? ' ' + className : '')}>
                <NavLink to={HootRoutes.Settings} className={styles.settingsButton}>
                    <img className={styles.iconImage} src={SettingsIco} alt="Settings" />
                </NavLink>
                <h1 className={styles.title}>
                    {title}
                </h1>
                <WalletControl />
            </header>
            {showBanner && <CoinsBanner />}
        </>
    )
};