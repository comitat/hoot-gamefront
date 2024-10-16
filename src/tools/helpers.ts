
import { format } from "date-fns";

import hootImg from '@assets/imgs/coins/HootCoin.svg';
import usdtImg from '@assets/imgs/coins/usdt.png';
import usdImg from '@assets/imgs/coins/usd.png';
import tonImg from '@assets/imgs/coins/ton.png';

import { MIN_AUTOMINING_TIME } from './constants';
import { Currency, PricePair } from "@models/common";

export function isEnergyPositive(energy: number) {
    return energy > 0;
}

export function isEnergyEmpty(energy: number) {
    return !energy || energy < 0.001;
}

export const getMinAutomoningTimeDiff = (timeStart: number) => {
    const timeNow = new Date().valueOf();
    return timeNow - timeStart;
}

export const isMinAutomoningTimeOff = (timeStart: number) => {
    return getMinAutomoningTimeDiff(timeStart) < MIN_AUTOMINING_TIME;
}

export const getMinAutomoningTimeLasts = (timeStart: number) => {
    return MIN_AUTOMINING_TIME - getMinAutomoningTimeDiff(timeStart);
}

export const getCoinImg = (token?: Currency) => {
    let coinImgPath: string;
    switch (token) {
        case Currency.HOOT:
            coinImgPath = hootImg;
            break;
        case Currency.USD:
            coinImgPath = usdImg;
            break;
        case Currency.USDT:
            coinImgPath = usdtImg;
            break;
        case Currency.TON:
            coinImgPath = tonImg;
            break;
        default:
            coinImgPath = hootImg;
    }
    return coinImgPath;
}

export const formatDateDigits = (isoDateStr: string) => {
    return format(new Date(isoDateStr), 'yyyy.MM.dd');
}

export const getFormattedDate = (isoDateStr: string, formatStr = 'dd.MM.yyyy') => {
    return format(new Date(isoDateStr), formatStr);
}

export const getFormattedTime = (isoDateStr: string, formatStr = 'HH:mm:ss') => {
    return format(new Date(isoDateStr), formatStr);
}

export const getConvertedValue = (from: Currency, to: Currency, pairs: PricePair[], value: number) => {
    const multiplierPrice = pairs.find((pair) => pair.tokenFrom === from && pair.tokenTo === to)?.price;
    if (!multiplierPrice || !value) {
        return null;
    }

    return value * Number(multiplierPrice);
}

export const getIncreaseAmont = (amount: number, secondsPassed: number, percentage: number) => {
    return amount / (365*24*60*60) * secondsPassed * percentage / 100;
}

export const getHourPercentage = (amount: number, yearPercentage: number) => {
    return (amount / 100) * yearPercentage / (365*24);
}

export const getWeekPercentageProfit = (amount: number, yearPercentage: number) => {
    return (amount / 100) * yearPercentage / (365/7);
}

export const getMinusTax = (amount: number, persentage: number) => {
    return ((amount / 100) * (100 - persentage)).toFixed(2);
}

export const getCoinPercent = (token?: Currency) => {
    let coinPercent: number;
    switch (token) {
        case Currency.HOOT:
            coinPercent = 25;
            break;
        case 'USD':
            coinPercent = 1;
            break;
        case 'USDT':
            coinPercent = 1;
            break;
        case 'TON':
            coinPercent = 12;
            break;
        default:
            coinPercent = 1;
    }
    return coinPercent;
}