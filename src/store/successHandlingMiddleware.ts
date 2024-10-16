import { MiddlewareAPI, AnyAction, Dispatch } from '@reduxjs/toolkit';

import { Fields } from '@models/localStorage';
import { MessageOwlStopFarming } from '@components/messagesContent/MessageOwlStopFarming';

import { initMiningAction } from './miningSlice'
import { addMessage } from '@store/appSlice';
import i18next from 'i18next';
import { MessageOwlFarmingSuccess } from '@components/messagesContent/MessageOwlFarmingSuccess';
import { MessageOwlDailySuccess } from '@components/messagesContent/MessageOwlDailySuccess';

export const successHandlingMiddleware = (store: MiddlewareAPI<Dispatch<AnyAction>, any>) => (next: Dispatch) => (
    action: AnyAction,
) => {

    if (action.type === 'user/register/fulfilled') {
        console.log(' registered > ', action.payload);
        if (action.payload?.token?.token) {
            localStorage.setItem(Fields.Token, action.payload.token.token);
            // @ts-ignore
            store.dispatch(initMiningAction());
        }
    }

    if (action.type === "farming/stop/pending") {
        store.dispatch(addMessage({
            title: i18next.t('pages.farming.receivedIncome'),
            ContentComponent: MessageOwlStopFarming,
        })); 
    }

    if (action.type === 'farming/create/fulfilled') {
        store.dispatch(addMessage({
            title: i18next.t('pages.farming.createSuccess'),
            ContentComponent: MessageOwlFarmingSuccess,
        }));
    }

    if (action.type === 'event/daily/claim/fulfilled') {
        store.dispatch(addMessage({
            title: i18next.t('pages.events.createSuccess'),
            ContentComponent: MessageOwlDailySuccess,
        }));
    }

    return next(action);
};