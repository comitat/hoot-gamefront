
import { SubPageTitle } from '@components/SubPageTitle';

import styles from './styles.module.scss';

export function SetLanguage() {
    return (
        <div className={styles.page}>
            <SubPageTitle title='Preferences center' />
            - SetLanguage
        </div>
    );
}