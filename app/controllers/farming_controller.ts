import type { HttpContext } from '@adonisjs/core/http'
import Farming from "#models/farming";
import {DateTime} from "luxon";
import {CreateFarmingValidator, GetFarmingValidator} from "#validators/farming";
import farmingConfig  from '#config/farming'
import {getFarmingResponse, getFarmingsResponse, getFarmingStatusResponse} from "#controllers/mappers/farming_mapper";
import { v4 as uuidv4 } from 'uuid';
import PairPrice from "#models/pair_price";
import Account from "#models/account";
import EventStatus from "#models/event_status";
import Event from "#models/event";

export default class FarmingController {

  async create({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const payload = await request.validateUsing(CreateFarmingValidator)

    let miningFarm = await user.related('miningFarm').query().first()

    if (!miningFarm) {
      return response.badRequest({error: 'Mining farm not found'})
    }

    if (miningFarm.hoots < payload.amount) {
      return response.badRequest({error: 'Insufficient hoots'})
    }

    const allPairPrices = await PairPrice.query().orderBy('id', 'desc');

    const pairPrices = await PairPrice.query()
      .where('token_from', payload.token)
      .first()

    if (!pairPrices) {
      return response.badRequest({error: 'Pair price for token not found'})
    }

    let amount  = parseFloat(payload.amount) * pairPrices.price; // convert to USDT

    let percentage = farmingConfig.percentage[payload.token]

    let eventStatus = null
    if (payload.token === 'HOOT' && (payload.eventSlug === 'start-farming-50-hoot' || payload.eventSlug === 'start-farming-500-hoot')) {
      if ((payload.eventSlug === 'start-farming-50-hoot' && payload.amount !== 50)
          || (payload.eventSlug === 'start-farming-500-hoot' && payload.amount !== 500)) {
          return response.badRequest({error: 'Invalid amount for event'})
      }
      let event = await Event.findByOrFail('slug', payload.eventSlug)
      eventStatus = await EventStatus.query().where('userId', user.id).where('eventId', event.id).first()
      if (eventStatus) {
        return response.badRequest({error: 'Event already used'})
      }

      const eventPayloadDefault = {
        eventId: event.id,
        status: '1',
        userId: user.id
      }
      eventStatus = await EventStatus.create(eventPayloadDefault)

      percentage += farmingConfig.events[payload.eventSlug].hoot.addPercentage
    }


    const payloadDefault = {
      farmId: uuidv4(),
      startedAt: DateTime.now(),
      endedAt: null,
      token: payload.token,
      amount: amount,
      amountOriginal: payload.amount,
      percentage: percentage,
      isActive: true
    }
    const farming = await Farming.create({...payloadDefault, userId: user.id})

    miningFarm = await miningFarm.merge({
      hoots: parseFloat(miningFarm.hoots) - payload.amount
    }).save()


    let account = await user.related('account').query().first()
    if (!account) {
      const payloadDefault = {
        hoot: miningFarm.hoots,
        ton: 0
      }
      account = await Account.create({...payloadDefault, userId: user.id})
    } else {
      account = await account.merge({
        hoot: miningFarm.hoots
      }).save()
    }

    return response.ok(await getFarmingResponse(farming, account, true, eventStatus))
  }

  async getAll({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const payload = await request.validateUsing(GetFarmingValidator)

    const farmingsQuery = Farming.query()
      .whereHas('user', (query) => {
        query.where('id', user.id)
      })
      .orderBy('created_at', 'asc')

    if (payload.isActive === true) {
      farmingsQuery.where('isActive', true)
    } else if (payload.isEnded === true) {
      farmingsQuery.whereNotNull('endedAt')
    }

    let farmings = await farmingsQuery.exec()

    farmings = farmings.map( (farming) => {
      if (farming.isActive) {
        let amount = parseFloat(farming.amount);
        let secondsPassed = DateTime.now().diff(DateTime.fromMillis(farming.startedAt.getTime()), 'seconds').seconds;
        farming.amount = this.calculateAmountWithInterest(amount, secondsPassed, parseFloat(farming.percentage));
      }
      return farming
    })

    return response.ok(await getFarmingsResponse(farmings))
  }

  private calculateAmountWithInterest (amount: number, secondsPassed: number, percentage: number): number {
    return amount + (amount / (365 * 24 * 60 * 60)) * secondsPassed * (percentage / 100);
  }

  async stop({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    let farming = await Farming.findByOrFail('farmId', request.param('id'))

    if (!farming.isActive || farming.endedAt !== null) {
      return response.badRequest({error: 'Farming already stopped'})
    }

    farming = await farming.merge({
      endedAt: DateTime.now(),
      isActive: false
    }).save()

    let miningFarm = await user.related('miningFarm').query().first()

    if (!miningFarm) {
      return response.badRequest({error: 'Mining farm not found'})
    }

    const allPairPrices = await PairPrice.query().orderBy('id', 'desc');

    const pairPrices = await PairPrice.query()
      .where('token_from', farming.token)
      .first()

    if (!pairPrices) {
      return response.badRequest({error: 'Pair price for token not found'})
    }

    let amount = parseFloat(farming.amount);
    let secondsPassed = farming.endedAt.diff(DateTime.fromMillis(farming.startedAt.getTime()), 'seconds').seconds;
    amount = this.calculateAmountWithInterest(amount, secondsPassed, parseFloat(farming.percentage));
    const hoots = amount / pairPrices.price; // convert to HOOT

    miningFarm = await miningFarm.merge({
      hoots: parseFloat(miningFarm.hoots) + hoots
    }).save()

    await farming.merge({
      amount: hoots
    }).save()

    let account = await user.related('account').query().first()
    if (!account) {
      const payloadDefault = {
        hoot: miningFarm.hoots,
        ton: 0
      }
      account = await Account.create({...payloadDefault, userId: user.id})
    } else {
      account = await account.merge({
        hoot: miningFarm.hoots
      }).save()
    }

    return response.ok(await getFarmingResponse(farming, account))
  }

  async status({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    let farming = await Farming.findByOrFail('farmId', request.param('id'))

    if (!farming.isActive || farming.endedAt !== null) {
      return response.badRequest({error: 'Farming already stopped'})
    }

    let miningFarm = await user.related('miningFarm').query().first()

    if (!miningFarm) {
      return response.badRequest({error: 'Mining farm not found'})
    }

    let amount = parseFloat(farming.amount);
    let secondsPassed = DateTime.now().diff(DateTime.fromMillis(farming.startedAt.getTime()), 'seconds').seconds;
    amount = this.calculateAmountWithInterest(amount, secondsPassed, parseFloat(farming.percentage));

    return response.ok(await getFarmingStatusResponse(farming, amount))
  }


}
