import { FC, ReactNode } from 'react';
import styles from './styles.module.scss';

interface Props {
    children: ReactNode;
}

export const Layout: FC<Props> = ({ children }) => (
    <div className={styles.layout}>
        {children}
    </div>
);