import { FC, ReactNode, useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { v4 as uuidv4 } from 'uuid';
import { throttle } from 'lodash';

import {
    postMiningTapAction,
    upTaps,
    localDataUpdateAction,
    superTap,
} from '@store/miningSlice';
import { AppDispatch } from '@store/store'; // useAppSelector

import {
    PopCorn,
    PopCornType,
} from '@components/PopCorn/PopCorn';
import { Box, useToast } from '@chakra-ui/react';

// prevent right overflow
const POP_WIDTH = 70;
const RANDOM_AREA = 30;
const AREA_CENTER_TOP = 300;
interface Props {
    children?: ReactNode;
    classNames?: string;
    isDisabled: boolean;
    showAutoTaps: boolean;
    level: number;
    noEnergy: boolean;
}

export const TapZone: FC<Props> = ({ children, classNames, isDisabled, level, showAutoTaps, noEnergy }) => {
    const [elements, setElements] = useState<PopCornType[]>([]);
    const toast = useToast();

    const dispatch = useDispatch<AppDispatch>();

    const sendTapsToApi = useCallback(throttle(async () => {
        dispatch(postMiningTapAction());
    }, 10000), []);

    const handleSuperTap = () => {
        if (isDisabled) {
            console.log(' > disabled <')
            return;
        }
        dispatch(superTap());
        dispatch(localDataUpdateAction());
        sendTapsToApi(); 
    }

    const showWarning = throttle(() => {
        toast({
            status: 'warning',
            duration: 2000,
            position: 'top',
            render: () => (
                <Box
                    color='roseRed'
                    p='0.75rem 1rem'
                    bg='bg.blockSolid'
                    marginTop='2rem'
                    width='calc(100vw - 2rem)'
                    borderRadius='block'
                >
                    {noEnergy ? 'Sorry, not enough energy!' : 'Sorry, Automining is active!'}
                  
                </Box>
              ),
        });
    }, 2100, { leading: true, trailing: false });
  
    const handleTap = useCallback(
        throttle((event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
            if (isDisabled) {
                showWarning();
                return;
            }

            dispatch(upTaps());
            dispatch(localDataUpdateAction());
            sendTapsToApi();

            let x = "clientX" in event ? event.clientX : event.touches[0].clientX;
            const y = "clientY" in event ? event.clientY : event.touches[0].clientY;

            const doc = document.documentElement;
            const scrollTop = doc.scrollTop - doc.clientTop;
            const docWidth = doc.clientWidth

            if (x > docWidth - POP_WIDTH) {
                x = docWidth - POP_WIDTH;
            }

            const yWithTopScroll = y + (scrollTop || 0);

            const newElement = { id: uuidv4(), x, y: yWithTopScroll, level };
        
            setElements((prevElements) => [...prevElements, newElement]);
        
            setTimeout(() => {
                setElements((prevElements) => prevElements.filter((el) => el.id !== newElement.id));
            }, 1000);
        }, 66, { leading: true, trailing: false }),
        [isDisabled, noEnergy],
    );

    const addAutominingTap = () => {
        const doc = document.documentElement;
        const docWidth = doc.clientWidth

        const x = Math.random() * RANDOM_AREA + (docWidth/2 - POP_WIDTH/2);
        const y = Math.random() * RANDOM_AREA + AREA_CENTER_TOP;

        const newElement = { id: uuidv4(), x, y, level };
    
        setElements((prevElements) => [...prevElements, newElement]);
    
        setTimeout(() => {
            setElements((prevElements) => prevElements.filter((el) => el.id !== newElement.id));
        }, 1000);
    }

    useEffect(() => {
        if (!showAutoTaps) {
            return;
        }

        const interval = setInterval(addAutominingTap, 1000);
    
        return () => clearInterval(interval);
      }, [showAutoTaps]);

    return (
        <div
            className={classNames}
            onClick={handleTap}
        >
            <div
                style={{
                    position: 'absolute',
                    right: '2rem',
                    height: '1rem',
                    width: '1rem',
                    marginTop: '-4.75rem',
                    color: 'white',
                    fontSize: '2rem',
                    opacity: 0.5
                }}
                onClick={handleSuperTap}
            >*</div>

            {children}

            {elements.map((el) => (
                <PopCorn level={level} key={el.id} id={el.id} x={el.x} y={el.y} />
            ))}
        </div>
    );
};