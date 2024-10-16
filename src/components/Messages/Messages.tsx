import { FC } from 'react';
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '@store/store';
import { deleteItem, Message } from '@store/appSlice';

import { PopMessage } from '@components/PopMessage';

export const Messages: FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { errors, messages } = useAppSelector((state) => state.app);
    const lastItem: Message | null = errors?.length && errors[errors.length - 1]
        || messages?.length && messages[messages.length - 1]
        || null;

    return (
        <>
            {lastItem && (
                <PopMessage
                    text={lastItem.message}
                    contentNode={lastItem.contentNode}
                    title={lastItem.title || (lastItem.code ? String(lastItem.code) : '')}
                    onClose={() => dispatch(deleteItem(lastItem.idNum))}
                    actionFunc={lastItem.actionFunc}
                    actionTitle={lastItem.actionTitle}
                    ContentComponent={lastItem.ContentComponent}
                    hideButton={lastItem.hideButton}
                />
            )}
        </>
    );
};