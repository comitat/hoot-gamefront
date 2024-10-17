import Farming from "#models/farming";
import Account from "#models/account";
import PairPrice from "#models/pair_price";
import EventStatus from "#models/event_status";
import {DateTime} from "luxon";

export const getFarmingResponse = async (farming: Farming, account: Account, isStart:boolean, eventStatus: EventStatus) => {

  const response = farming.serialize({
    fields: {
      omit: ['userId'],
    },
    relations: {
    },
  })

  delete response.amount;

  const ret = {
    ...response,
    account: {
      hoot: account.hoot,
      ton: account.ton,
    },
  }

  if (isStart) {
    ret.amountUsdt = farming.amount;
  } else {
    ret.totalAmount = farming.amount;
  }

  if (eventStatus) {
    ret.event = {
      status: eventStatus.status,
    }
  }

  return ret
}

export const getFarmingsResponse = async (farmings: Farming[]) => {
  const responses = await Promise.all(farmings.map(async (farming) => {
    const response = farming.serialize({
      fields: {
        omit: ['userId'],
      },
      relations: {
      },
    })

    delete response.amount;

    const ret = {
      ...response,
    }

    if (farming.isActive) {
      ret.totalAmountUsdt = farming.amount;
    } else {
      ret.totalAmount = farming.amount
    }

    return ret;
  }))

  return responses
}

export const getFarmingStatusResponse = async (farming: Farming, amount: number) => {

  const response = farming.serialize({
    fields: {
      omit: ['userId'],
    },
    relations: {
    },
  })

  delete response.amount;

  return {
    ...response,
    totalAmountUsdt: amount,
  }
}
