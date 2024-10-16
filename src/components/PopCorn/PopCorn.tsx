import { FC } from 'react';
import styles from './styles.module.scss';

export type PopCornType = {
    id: string;
    x: number;
    y: number;
    level: number;
};

export const PopCorn: FC<PopCornType> = ({ id, x, y, level }) => (
    <div
        key={id}
        style={{
            top: `${y}px`,
            left: `${x}px`,
        }}
        className={styles.popcorn}
    >
        +0.00{level} HOOT
    </div>
);