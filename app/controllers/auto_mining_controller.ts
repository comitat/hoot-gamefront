import type { HttpContext } from '@adonisjs/core/http'
import MiningFarm from "#models/mining_farm";
import { getMiningFarmResponse } from "#controllers/mappers/mining_farm_mapper";
import MiningFarmLogic from "game-calc-logic/mining-farm-logic.js";
import {MiningFarmState} from "game-calc-logic/mining-farm-logic.js";
import {StartAutoMiningFarmValidator, StopAutoMiningFarmValidator} from "#validators/mining_farm";


export default class AutoMiningController {
  async start({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const payload = await request.validateUsing(StartAutoMiningFarmValidator)

    const miningFarms = await MiningFarm.query()
      .whereHas('user', (query) => {
          query.where('id', user.id)
      })
    let miningFarm : MiningFarm;
    if (miningFarms.length === 0) {
      const payloadDefault = {
        level: 1,
        energy: MiningFarmLogic.START_ENERGY,
        temperature: MiningFarmLogic.START_TEMPERATURE,
        hoots: 0,
        lastTimestamp: payload.timestamp,
        lastTapCount: 0
      }
      miningFarm = await MiningFarm.create({ ...payloadDefault, userId: user.id })
    } else {
      miningFarm = miningFarms[0]
    }
    const farmLogic = new MiningFarmLogic(
      miningFarm.level,
      miningFarm.lastTimestamp,
      miningFarm.lastTapCount,
      miningFarm.energy,
      miningFarm.temperature,
      miningFarm.hoots,
      miningFarm.autoMiningEnabled,
      miningFarm.autoMiningStart,
      miningFarm.autoMiningEnd,
      miningFarm.autoMiningDuration,
    )

    try {
      farmLogic.startAutoMining(payload.timestamp, payload.duration)
    } catch (e) {
      if (e.message === 'Insufficient funds to start automining.') {
        return response.notAcceptable({message: e.message})
      } else {
        throw e
      }
    }

    const farmState = farmLogic.getState()

    const miningFarmUpdated = await miningFarm.merge({
      lastTimestamp: payload.timestamp,
      lastTapCount: farmState.lastTapCount,
      autoMiningEnabled: true,
      autoMiningDuration: payload.duration,
      autoMiningStart: payload.timestamp,
      autoMiningEnd: farmState.autoMining.endTime,
      energy: farmState.energy,
      hoots: farmState.hoots,
    }).save()

    return response.ok(await getMiningFarmResponse(miningFarmUpdated))
  }

  async stop({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const payload = await request.validateUsing(StopAutoMiningFarmValidator)

    const miningFarms = await MiningFarm.query()
      .whereHas('user', (query) => {
        query.where('id', user.id)
      })
    if (miningFarms.length > 0) {
      let miningFarm = miningFarms[0] as MiningFarm;

      const farmLogic = new MiningFarmLogic(
        miningFarm.level,
        miningFarm.lastTimestamp,
        miningFarm.lastTapCount,
        miningFarm.energy,
        miningFarm.temperature,
        miningFarm.hoots,
        miningFarm.autoMiningEnabled,
        miningFarm.autoMiningStart,
        miningFarm.autoMiningEnd,
        miningFarm.autoMiningDuration,
      )

      if (!miningFarm.autoMiningEnabled) {
        return response.notAcceptable({ message: 'Automining is not yet running.' })
      }

      const result = farmLogic.stopAutoMining(payload.timestamp)
      if (result) {
        const miningFarmUpdated = await miningFarm.merge({
          energy: (result as MiningFarmState).energy,
          temperature: (result as MiningFarmState).temperature,
          hoots: (result as MiningFarmState).hoots,
          lastTimestamp: payload.timestamp,
          lastTapCount: (result as MiningFarmState).lastTapCount,
          autoMiningEnabled: false,
          autoMiningDuration: null,
          autoMiningStart: null,
          autoMiningEnd: null
        }).save()

        return response.ok(await getMiningFarmResponse(miningFarmUpdated))
      }
      return response.notAcceptable({ message: 'Automining cannot be stopped yet.' })
    }
    return response.notFound()
  }
}
