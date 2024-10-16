import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '@store/store';
import { useTranslation } from 'react-i18next';

import EventGiftImg from '@assets/imgs/eventGift.svg';
import SuccessImg from '@assets/imgs/Success.svg';
import EventDailyImg from '@assets/imgs/eventDaily.png';
import EventMoneyImg from '@assets/imgs/eventMoney.png';
import EventOwlImg from '@assets/imgs/eventOwl.png';
import ArrowRight from '@assets/imgs/arrowRightLite.svg';

import { MessageEditFarming } from '@components/messagesContent/MessageEditFarming';
import { ButtonWrap } from '@components/ButtonWrap';

import { getCoinPercent } from '@tools/helpers';
import { SLUG_50, SLUG_500 } from '@tools/constants';

import { addMessage } from '@store/appSlice';
import { setFarmToCreate } from '@store/farmingSlice';
import { fetchDailyBonusClaim } from '@store/eventSlice';


import styles from './styles.module.scss';

interface Props {
    title: string;
    subTitle: string;
    type: number;
    slug: string;
    rewards: number | null;
    percentage: number | null;
    isInactive: boolean;
}

export const EventBlock: FC<Props> = ({ title, subTitle, type, slug, rewards, isInactive, percentage }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();

    const farming = useAppSelector((state) => state.farming);

    const getEventImg = (type: number) => {
        switch (type) {
            case 1:
                return EventDailyImg;
            case 2:
                return EventMoneyImg;
            case 3:
                return EventOwlImg;
            default:
                return;
        };
    };

    const handleEventClick = (slugTitle: string) => {
        if ([SLUG_50, SLUG_500].includes(slugTitle)) {
            dispatch(setFarmToCreate({
                amount: rewards,
                percentage: percentage || getCoinPercent(farming.createFarmingToken),
                token: farming.createFarmingToken,
                slug: slugTitle,
            }));
            dispatch(addMessage({
                title: t('pages.farming.confirmFarmDetails'),
                ContentComponent: MessageEditFarming,
                hideButton: true,
            }));
        } else {
            dispatch(fetchDailyBonusClaim());
        }
    };

    return (
        <div className={styles.eventBlockWrap}>
            <div className={styles.eventBlock}>
                <div className={styles.eventImgWrap}>
                    <img className={styles.eventImgGift} src={EventGiftImg}/>
                    <img className={styles.eventImgMain} src={getEventImg(type)}/>
                </div>

                <div className={styles.eventTitleWrap}>
                    <div className={styles.eventTitle}>
                        {title}
                    </div>
                    <div className={styles.eventSubTitle}>
                        {subTitle}
                    </div>
                </div>

                {isInactive ? (
                    <img className={styles.eventButtonImg} src={SuccessImg} />
                ) : (
                    <ButtonWrap size='sm' onClick={() => handleEventClick(slug)}>
                        <img className={styles.eventButtonImg} src={ArrowRight} />
                    </ButtonWrap>
                )}
            </div>
        </div>
    )
};