import { FC, useEffect } from 'react';
import { Switch, Progress, useTheme } from '@chakra-ui/react';

import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '@store/store';
import { addMessage, addError } from '@store/appSlice';
import {
    localDataUpdateAction,
} from '@store/miningSlice';

import { isMinAutomoningTimeOff } from '@tools/helpers';

import { MessageStopAutomining } from '@components/messagesContent/MessageStopAutomining';
import { MessageCantStopAutomining } from '@components/messagesContent/MessageCantStopAutomining';
import { MessageStartAutomining } from '@components/messagesContent/MessageStartAutomining';
import { MessageOwlOneNoHoots } from '@components/messagesContent/MessageOwlOneNoHoots';

import styles from './styles.module.scss';

const MIN_AUTOMINING_PRICE = 3;

export const Automining: FC = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const mining = useAppSelector((state) => state.mining);
    const noMoney = mining.hoots < MIN_AUTOMINING_PRICE;
    const isDisabled = !Boolean(mining.autoMiningEnabled) && noMoney;


    useEffect(() => {
        if (!mining.autoMiningEnabled) {
            return
        }

        const interval = setInterval(() => {
            dispatch(localDataUpdateAction());
        }, 250);
    
        return () => clearInterval(interval);
    }, [mining.autoMiningEnabled]);

    const handleChange = () => {
        if (mining.autoMiningEnabled) {
            if (isMinAutomoningTimeOff(mining.autoMiningStart)) {
                dispatch(addMessage({
                    title: t('pages.mining.cantStop'),
                    ContentComponent: MessageCantStopAutomining,
                }));
            } else {
                dispatch(addMessage({
                    title: t('pages.mining.stop automining'),
                    ContentComponent: MessageStopAutomining,
                    hideButton: true,
                }));
            }
        } else {
            dispatch(addMessage({
                title: t('pages.mining.start automining'),
                ContentComponent: MessageStartAutomining,
                hideButton: true,
            }));
        };
    };

    const handleDisabledClick = () => {
        if (isDisabled) {
            dispatch(addError({
                title: t('pages.mining.boost_problem'),
                ContentComponent: MessageOwlOneNoHoots,
            }));
        }
    }

    return (
        <div className={styles.autominingWrap + (Boolean(mining.autoMiningEnabled) ? ' ' + styles.autominingWrapWithProgress : '')}>
            <div className={styles.automining}>
                <label onClick={handleDisabledClick} className={styles.autominingLabel}>
                    <div className={styles.optionTitle}>
                        Automining
                        {Boolean(mining.autoMiningEnabled) && (
                            <div className={styles.time}>
                                {
                                    mining.lastsTime?.hours?.toString().padStart(2, '0')
                                }:{
                                    mining.lastsTime?.minutes?.toString().padStart(2, '0')
                                }:{
                                    mining.lastsTime?.seconds?.toString().padStart(2, '0')
                                }
                            </div>
                        )}
                    </div>
                    <Switch
                        size='lg'
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
                        isChecked={Boolean(mining.autoMiningEnabled)}
                        onChange={handleChange}
                        isDisabled={isDisabled}
                    />
                </label>
            </div>
            {Boolean(mining.autoMiningEnabled) && mining.lastsTime?.percent && (
                <Progress
                    value={mining.lastsTime?.percent}
                    size='xs'
                    marginBottom='-0.5rem'
                    backgroundColor='bg.grey'
                    color='#12a'
                    borderBottomRightRadius='block'
                    borderBottomLeftRadius='block'
                    sx={{
                        '& > div': {
                            'backgroundColor': theme.colors.bg.blueTop,
                        },
                    }}
                />
            )}
        </div>
    );
};