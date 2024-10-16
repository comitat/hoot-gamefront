import {
    NavLink,
    NavLinkRenderProps,
} from 'react-router-dom';

import { HootRoutes } from '@models/routes';

import Events from '@assets/imgs/Events.svg';
import EventsOn from '@assets/imgs/EventsOn.svg';
import Farming from '@assets/imgs/Farming.svg';
import FarmingOn from '@assets/imgs/FarmingOn.svg';
import Tapex from '@assets/imgs/Tapex.svg';
import TapexOn from '@assets/imgs/TapexOn.svg';
import Mining from '@assets/imgs/Mining.svg';
import MiningOn from '@assets/imgs/MiningOn.svg';

import styles from './styles.module.scss';

export function MainMenu() {
    const getLinkClass = ({ isActive }: NavLinkRenderProps) => (isActive ? styles.navLinkActive : styles.navLink);
    return (
        <nav className={styles.navMain}>
            <ul className={styles.navItemsWrap}>
                <li className={styles.navItem}>
                    <NavLink to={HootRoutes.Mining} className={getLinkClass}>
                        <div className={styles.icon}>
                            <img className={styles.iconImageOn} src={MiningOn} alt="Mining" />
                            <img className={styles.iconImage} src={Mining} alt="Mining" />
                        </div>
                        Mining
                    </NavLink>
                </li>
                <li className={styles.navItem}>
                    <NavLink to={HootRoutes.TapEX} className={getLinkClass}>
                        <div className={styles.icon}>
                            <img className={styles.iconImageOn} src={TapexOn} alt="TapEX" />
                            <img className={styles.iconImage} src={Tapex} alt="TapEX" />
                        </div>
                        TapEX
                    </NavLink>
                </li>
                <li className={styles.navItem}>
                    <NavLink to={HootRoutes.Farming} className={getLinkClass}>
                        <div className={styles.icon}>
                            <img className={styles.iconImageOn} src={FarmingOn} alt="Farming" />
                            <img className={styles.iconImage} src={Farming} alt="Farming" />
                        </div>
                        Farming
                    </NavLink>
                </li>
                <li className={styles.navItem}>
                    <NavLink to={HootRoutes.Events} className={getLinkClass}>
                        <div className={styles.icon}>
                            <img className={styles.iconImageOn} src={EventsOn} alt="Events" />
                            <img className={styles.iconImage} src={Events} alt="Events" />
                        </div>
                        Events
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}