import type { HttpContext } from '@adonisjs/core/http'
import {TriggerEventValidator, GetEventValidator, DailyEventValidator} from "#validators/event";
import {getEventStatusResponse, getEventStatusesResponse} from "#controllers/mappers/event_mapper";
import EventStatus from "#models/event_status";
import Event from "#models/event";
import MiningFarm from "#models/mining_farm";
import User from "#models/user";
import {getMiningFarmResponse} from "#controllers/mappers/mining_farm_mapper";

export default class EventController {

  async getAllStatuses({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const eventStatuses = await EventStatus.query()
      .whereHas('user', (query) => {
        query.where('id', user.id)
      })
      .preload('event')

    return response.ok(await getEventStatusesResponse(eventStatuses))
  }

  /*
  * status: 0 - bonus not available yet, 1 - bonus available, 2 - bonus claimed
  */
  private async calcBonus(user: User, eventStatus: EventStatus): number {
    let miningFarm = await MiningFarm.findByOrFail('user', user.id)

    let canRegisterBonus = false
    let useMinimalValue = false
    // const curTime = 1728894190958 + 1*24*60*60*1000;
    // let dayIndex = new Date(curTime).getDay();
    const curTime = Date.now();
    let dayIndex = new Date().getDay();

    const isMonday =  dayIndex === 1;
    if (isMonday) {
      let isDifferentMonday = false;
      let isLastVisitedMonday = false;
      if (eventStatus) {
        const lastVisitedAt = new Date(eventStatus.lastVisitedAt);
        const lastVisitedDayIndex = lastVisitedAt.getDay();
        isLastVisitedMonday = lastVisitedDayIndex === 1;
        isDifferentMonday = isLastVisitedMonday && lastVisitedAt.toDateString() !== new Date().toDateString();
      }

      canRegisterBonus = true;
      useMinimalValue = false;

      if (eventStatus && eventStatus.status === '2') {
        canRegisterBonus = false;
        if (isDifferentMonday || !isLastVisitedMonday) {
          canRegisterBonus = true;
        }
      }
    } else  {
      if (eventStatus) {
        const lastVisitedAt = new Date(eventStatus.lastVisitedAt)
        const wasYesterday = lastVisitedAt.toDateString() === new Date(curTime - 86400000).toDateString()
        const isToday = lastVisitedAt.toDateString() === new Date(curTime).toDateString()
        const moreThanYesterday = lastVisitedAt.getTime() < curTime - 86400000
        if (isToday || wasYesterday || moreThanYesterday) {
          canRegisterBonus = true
        }
        if (moreThanYesterday || eventStatus.param1 === '1') {
          dayIndex = 1
          useMinimalValue = true
        }

        if (eventStatus.status === '2') {
          canRegisterBonus = false;
          if (wasYesterday) {
            canRegisterBonus = true
          }
        }
      } else {
        canRegisterBonus = true
        useMinimalValue = true
        dayIndex = 1
      }
    }

    let bonusValue = 0
    if (canRegisterBonus) {
      bonusValue = dayIndex * miningFarm.level * 50;
    }
    return {bonusValue, useMinimalValue};
  }

  /*
  *   payload for EventStatus:
   *  param1: 0 - use normal value, 1 - use minimal value: dayIndex * miningFarm.level * 50, where dayIndex is always 1
   */
  async evalDailyBonus({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    let event = await Event.findByOrFail('slug', 'daily-bonus')
    let eventStatus = await EventStatus.query().where('userId', user.id).where('eventId', event.id).first()
    let {bonusValue, useMinimalValue} = await this.calcBonus(user, eventStatus);

    // const curTime = new Date(1728894190958 + 1*24*60*60*1000);
    const curTime = new Date();

    if (bonusValue) {
      const payload = {status: '1', param1: useMinimalValue ? '1' : '0'}
      if (!eventStatus || eventStatus.status !== '1') {
        payload.lastVisitedAt = curTime
      }
      eventStatus = await EventStatus.updateOrCreate(
        {event: event.id, user: user.id},
        payload
      )
    } else if (!eventStatus || eventStatus.status !== '2') {
      eventStatus = await EventStatus.updateOrCreate(
        {event: event.id, user: user.id},
        {status: '0', param1: useMinimalValue ? '1' : '0'}
      )
    }


    return response.ok(await getEventStatusResponse(eventStatus, bonusValue))
  }

  async claimDailyBonus({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(DailyEventValidator)
    let event = await Event.findByOrFail('slug', 'daily-bonus')
    let eventStatus = await EventStatus.query().where('userId', user.id).where('eventId', event.id).first()
    let {bonusValue, useMinimalValue} = await this.calcBonus(user, eventStatus);
    let miningFarm = await MiningFarm.findByOrFail('user', user.id)

    // const curTime = new Date(1728894190958 + 1*24*60*60*1000);
    const curTime = new Date();

    if (bonusValue && eventStatus.status === '1') {
      await EventStatus.updateOrCreate(
          {event: event.id, user: user.id},
          {status: '2', lastVisitedAt: curTime}
      )
      miningFarm = await miningFarm.merge({
            energy: parseFloat(miningFarm.energy) + bonusValue,
            lastTimestamp: payload.timestamp
        }).save()
    }
    return response.ok(await getMiningFarmResponse(miningFarm, bonusValue))
  }
}
