import { FC, ReactNode } from 'react';
import styles from './styles.module.scss';

interface Props {
    children: ReactNode;
}

export const PagesWrapper: FC<Props> = ({ children }) => (
    <div className={styles.wrapper}>
        {children}
    </div>
);