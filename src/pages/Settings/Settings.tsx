import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import {
  Box,
  Switch,
  useTheme,
} from '@chakra-ui/react';

import { HootRoutes } from '@models/routes';
import { Fields } from '@models/localStorage';

import World from '@assets/imgs/World.svg';
import Bell from '@assets/imgs/Bell.svg';
import Question from '@assets/imgs/Question.svg';
import ArrowRight from '@assets/imgs/ArrowRight.svg';

import { fetchUser } from '@store/userSlice';
import { AppDispatch, useAppSelector } from '@store/store';

import { PageTitle } from '@components/PageTitle';

import styles from './styles.module.scss';

export function Settings() {
    const user = useAppSelector((state) => state.user);
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const theme = useTheme();
  
    useEffect(() => {
        dispatch(fetchUser());
    }, []);

    return (
        <div className={styles.page}>
            <PageTitle title='Preferences center' showBanner={false} />

            <Box
                bg="bg.block"
                borderRadius="block"
                margin='1rem 0'
            >
                <ul>
                    <li>
                        <div className={styles.option}>
                          <img className={styles.optionIco} src={Bell} />
                          <div className={styles.optionTitle}>{t('pages.settings.sound')}</div>
                          <Switch
                              size='md'
                              margin='0.25rem 0.25rem 0 0'
                              sx={{
                                  'span.chakra-switch__track': {
                                      'bg': theme.colors.bg.grey,
                                  },
                                  'span.chakra-switch__track[data-checked]': {
                                      'bg': theme.colors.bg.blueTop,
                                      'boxShadow': `0 -1rem 1rem -0.5rem ${theme.colors.bg.blueBottom} inset`,
                                  },
                              }}
                          />
                        </div>
                    </li>
                    <li>
                        <NavLink to={HootRoutes.SetLanguage} className={styles.option}>
                            <img className={styles.optionIco} src={World} />
                            <div className={styles.optionTitle}>{t('pages.settings.language')}</div>
                            <div className={styles.optionLabel}>
                                <div className={styles.optionLabelName}>
                                    English
                                </div>
                                <img className={styles.iconArrow} src={ArrowRight} alt="Go" />
                            </div>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={HootRoutes.Help} className={styles.option}>
                            <img className={styles.optionIco} src={Question} />
                            <div className={styles.optionTitle}>{t('pages.settings.help center')}</div>
                        </NavLink>
                    </li>
                </ul>
            </Box>
            <br />
            - set 
            <br />
            usr: {JSON.stringify(user)|| '-'}
            
            - set 
            <br />
            - set 
            <br />
            - set 
            <br />
            - set 
            <br />
            - set 8

            - set 
            <br />
            - set 
            <br />
            - set 
            <br />
            - set 
            <br />
            - set 7
            <br />
            - set 
            <br />
            - set 
            <br />
            - set 
            <br />
            - set 
            <br />6
            - set 
            <br />
            - set 
            <br />
            - set 
            <br />
            - set 
            <br />
            - set 5
            <br />
            - set 
            <br />
            - set 
            <br />
            - set 
            <br />
            - set 
            <br />4
            - set 
            <br />
            - set 
            <br />
            - set 
            <br />
            <br />
            - set 3
            <br />
            - set 
            <br />
            - set             <br />
            - set 
            <br />
            - set 
            <br />2
            - set             <br />
            - set 
            <br />
            - set 
            <br />
            - set             <br />
            - set 
            <br />
            - set 1
            <br />
            - set 
            = - = - =
            <br /><br /><br />
            {localStorage.getItem(Fields.Token)}

            <br />
            <br />
            - set 
            <br />
            - set 0
            <br />
            <span
                onClick={() => {
                    localStorage.setItem(Fields.Token, '');
                }}
                style={{
                    fontWeight: 'bold',
                }}
            >
                # CLEAR TOKEN #
            </span>
            <br />
        </div>
    );
}