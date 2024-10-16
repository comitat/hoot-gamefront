import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Tabs, Tab, TabList, TabPanels, TabPanel, Box } from "@chakra-ui/react";

import { AppDispatch, useAppSelector } from '@store/store';
import {
    fetchEventStatuses,
    EventStatus,
    fetchDailyBonusEval,
} from '@store/eventSlice';

import { PageTitle } from '@components/PageTitle';
import { EventBlock } from '@components/EventBlock';

import { SLUG_50, SLUG_500 } from '@tools/constants';

import styles from './styles.module.scss';

const getEventStateBySlug = (eventsStatusesList: EventStatus[] | null, slug: typeof  SLUG_50 | typeof SLUG_500) => {
    return !eventsStatusesList?.length
        || !!eventsStatusesList?.find((eventStatus) => (
        eventStatus.event.slug === slug
    ));
}

export function Events() {
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation();
    const events = useAppSelector((state) => state.events);

    useEffect(() => {
        dispatch(fetchEventStatuses());
        dispatch(fetchDailyBonusEval());
    }, []);

    const eventList = useMemo(() => ([
        {
            title: "Start farming 50 HOOT",
            subTitle: "+100% APY to farming",
            type: 2,
            slug: SLUG_50,
            isInactive: getEventStateBySlug(events.eventsStatuses, SLUG_50),
            rewards: 50,
            percentage: 75,
        },
        {
            title: "Start farming 500 HOOT",
            subTitle: "+100% APY to farming",
            type: 3,
            slug: SLUG_500,
            isInactive: getEventStateBySlug(events.eventsStatuses, SLUG_500),
            rewards: 500,
            percentage: 75,
        },
        {
            title: "Daily bonus",
            subTitle: events.dailyBonusEnergy
                ? `+${events.dailyBonusEnergy} kWtap`
                : '',
            type: 1,
            slug: "daily-bonus",
            isInactive: !events.dailyBonusAvailable,
            rewards: null,
            percentage: null,
        },
    ]), [events.eventsStatuses, events.dailyBonusEnergy, events.dailyBonusAvailable]);


    return (
        <div className={styles.page}>
            <PageTitle title='Events center' />

            <Box
                backgroundColor="bg.transparentEv" 
                margin="1.25rem 0 0"
                padding="0.5rem"
            >
                <Tabs variant='soft-rounded' colorScheme='green'>
                        <TabList justifyContent="center">
                            <Tab
                                borderRadius='button'
                                color='aWhite'
                                flexGrow={1}
                                fontWeight='normal'
                                _selected={{
                                    fontWeight: "bold",
                                    backgroundColor: 'bg.tab'
                                }}
                            >
                                {t('pages.events.currentEvents')}
                            </Tab>
                            <Tab
                                borderRadius='button'
                                color='aWhite'
                                flexGrow={1}
                                fontWeight='normal'
                                _selected={{
                                    fontWeight: "bold",
                                    backgroundColor: 'bg.tab',
                                }}
                            >
                                {t('pages.events.featuresRoadmap')}
                            </Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel padding='1rem 0 0'>
                                {eventList.map((event, index) => (
                                    <EventBlock
                                        key={index}
                                        title={event.title}
                                        subTitle={event.subTitle}
                                        type={event.type}
                                        slug={event.slug}
                                        rewards={event.rewards}
                                        isInactive={event.isInactive}
                                        percentage={event.percentage}
                                    />
                                ))}
                                
                            </TabPanel>
                            <TabPanel padding='1rem 0 0'>
                                Nothing here
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
        </div>
    );
}