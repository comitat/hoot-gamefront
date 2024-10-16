import { MiddlewareAPI, AnyAction, Dispatch } from '@reduxjs/toolkit';
import i18next from 'i18next';

import { MessageOwlOneNoHoots } from '@components/messagesContent/MessageOwlOneNoHoots';

import { addError } from './appSlice';
import { registerUserAction } from './userSlice';

export const errorHandlingMiddleware = (store: MiddlewareAPI<Dispatch<AnyAction>, any>) => (next: Dispatch) => (
    action: AnyAction,
) => {

    if (action.type !== 'mining/localDataUpdateAction') {
        console.log('middleware action.type >> ', action);
    }

    if (action.type === 'mining/auto:stop/rejected') {
        store.dispatch(addError({
            message: action.payload.response?.data?.message,
            code: action.payload.response?.statusText,
        }));
    }
    if (action.type === 'mining/init/rejected') {
        if (action.payload.response?.status && Math.floor(action.payload.response?.status/100) === 4) {
            store.dispatch(addError({
                message: action.payload.response?.data?.message,
                code: action.payload.response?.status,
                actionFunc: () => {
                    // @ts-ignore
                    store.dispatch(registerUserAction());
                },
                actionTitle: 'Authorize',
            }));
        } else {
            store.dispatch(addError({
                message: action.payload.response?.data?.message || JSON.stringify(action.payload.response || {}),
                code: action.payload.response?.status,
                actionFunc: () => {
                    // @ts-ignore
                    store.dispatch(registerUserAction());
                },
                actionTitle: 'Authorize',
            }));
        }
    }

    // default error message
    if (
        action.type === 'mining/tap/rejected'
    ) {
        store.dispatch(addError({
            message: action.error?.message,
            code: action.error?.code,
        }));
    }

    if (action.type === 'upgrade/level/rejected') {
        store.dispatch(addError({
            message: i18next.t('pages.mining.level_problem_message'),
            ContentComponent: MessageOwlOneNoHoots,
            code: i18next.t('pages.mining.level_problem_title'),
        }));
    }

    if (action.type === 'upgrade/energy/rejected') {
        store.dispatch(addError({
            title: i18next.t('pages.mining.boost_problem'),
            ContentComponent: MessageOwlOneNoHoots,
        }));
    }

    if (action.type === 'farming/create/rejected') {
        store.dispatch(addError({
            message: i18next.t('pages.mining.level_problem_message'),
            ContentComponent: MessageOwlOneNoHoots,
            code: i18next.t('pages.mining.level_problem_title'),
        }));
    }

    if (action.type === 'user/register/rejected') {
        store.dispatch(addError({
            message: action.error?.message,
            code: action.error?.code,
            actionFunc: () => {
                // @ts-ignore
                store.dispatch(registerUserAction());
            },
            actionTitle: 'Retry',
        }));
    }

    return next(action);
};