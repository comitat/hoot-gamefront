
import { SubPageTitle } from '@components/SubPageTitle';

import styles from './styles.module.scss';

export function Help() {
    return (
        <div className={styles.page}>
            <SubPageTitle title='Preferences center' />
            - Help
        </div>
    );
}