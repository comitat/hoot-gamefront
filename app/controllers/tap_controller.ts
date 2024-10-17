import type {HttpContext} from '@adonisjs/core/http'
import MiningFarm from "#models/mining_farm";
import { getMiningFarmResponse } from "#controllers/mappers/mining_farm_mapper";
import MiningFarmLogic from "game-calc-logic/mining-farm-logic.js";
import {InitMiningFarmValidator, TapMiningFarmValidator} from "#validators/mining_farm";


export default class TapController {
  async init({request, response, auth}: HttpContext) {
    const user = auth.getUserOrFail()

    const miningFarms = await MiningFarm.query()
      .whereHas('user', (query) => {
        query.where('id', user.id)
      })
    let miningFarm: MiningFarm, miningFarmUpdated: MiningFarm;
    if (miningFarms.length === 0) {
      const payload = await request.validateUsing(InitMiningFarmValidator)
      const payloadDefault = {
        level: 1,
        energy: MiningFarmLogic.START_ENERGY,
        temperature: MiningFarmLogic.START_TEMPERATURE,
        hoots: 0,
        lastTimestamp: payload.timestamp,
        lastTapCount: 0
      }
      miningFarmUpdated = await MiningFarm.create({...payloadDefault, userId: user.id})
    } else {
      miningFarm = miningFarms[0]

      const payload = await request.validateUsing(InitMiningFarmValidator)

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
        miningFarm.autoMiningDuration
      )

      const data = farmLogic.calculateNextStateWithoutTaps(payload.timestamp)

      const wasAutoMiningEnabled = miningFarm.autoMiningEnabled;

      let wasZeroEnergy = false;
      if (miningFarm.energy === 0) {
        wasZeroEnergy = true;
      }

      const newState = {
        lastTimestamp: payload.timestamp,
        energy: data.energy,
        temperature: data.temperature,
        hoots: data.hoots,
        autoMiningEnabled: data.autoMining.isActive,
        autoMiningStart: data.autoMining.startTime,
        autoMiningEnd: data.autoMining.endTime,
        autoMiningDuration: data.autoMining.duration
      }

      if (data.energy === 0) {
        wasZeroEnergy = true;
      }

      if (!data.autoMining.isActive) {
        newState.lastTapCount = data.lastTapCount;
      }

      if (wasZeroEnergy) {
        newState.lastTimestamp = payload.timestamp;
      }

      if (data.autoMining.isActive) {
        newState.autoMiningStart = payload.timestamp;
      }

      miningFarmUpdated = await miningFarm.merge(newState)

      if (wasAutoMiningEnabled && !data.autoMining.isActive) {
        miningFarmUpdated.save()
      }

      if (data.autoMining.isActive) {
        miningFarmUpdated.save()
      }

      if (wasZeroEnergy) {
        miningFarmUpdated.save()
      }

      miningFarmUpdated.lastTapCount = data.lastTapCount;

    }
    const mf = await getMiningFarmResponse(miningFarmUpdated)
    return response.ok(mf)
  }

  async tap({request, response, auth}: HttpContext) {
    const user = auth.getUserOrFail()

    const miningFarms = await MiningFarm.query()
      .whereHas('user', (query) => {
        query.where('id', user.id)
      })
    let miningFarm: MiningFarm
    const payload = await request.validateUsing(TapMiningFarmValidator)
    if (miningFarms.length === 0) {
      const payloadDefault = {
        level: 1,
        energy: MiningFarmLogic.START_ENERGY,
        temperature: MiningFarmLogic.START_TEMPERATURE,
        hoots: 0,
        lastTimestamp: payload.timestamp,
        lastTapCount: 0
      }
      miningFarm = await MiningFarm.create({...payloadDefault, userId: user.id})
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
      miningFarm.autoMiningDuration
    )
    const data = farmLogic.calculateState(payload.timestamp, payload.count)
    console.log(data)

    const miningFarmUpdated = await miningFarm.merge({
      lastTimestamp: payload.timestamp,
      energy: data.energy,
      temperature: data.temperature,
      hoots: data.hoots,
      lastTapCount: data.lastTapCount
    }).save()

    const mf = await getMiningFarmResponse(miningFarmUpdated)
    return response.ok(mf)
  }
}
