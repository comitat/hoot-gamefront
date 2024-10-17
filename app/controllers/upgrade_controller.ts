import type {HttpContext} from '@adonisjs/core/http'
import MiningFarm from "#models/mining_farm";
import {UpgradeLevelValidator, UpgradeEnergyValidator} from "#validators/mining_farm";
import MiningFarmLogic from "game-calc-logic/mining-farm-logic.js";
import {getMiningFarmResponse} from "#controllers/mappers/mining_farm_mapper";

export default class TapController {
  async level({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const payload = await request.validateUsing(UpgradeLevelValidator)

    const miningFarms = await MiningFarm.query()
      .whereHas('user', (query) => {
        query.where('id', user.id)
      })
    if (miningFarms.length > 0) {
      let miningFarm: MiningFarm = miningFarms[0];

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
        farmLogic.setLevel(payload.level, payload.timestamp)
      } catch (e) {
        if (e.message === 'Insufficient funds to upgrade level.') {
          return response.notAcceptable({message: e.message})
        } else {
          throw e
        }
      }

      const farmState = farmLogic.getState()

      const miningFarmUpdated = await miningFarm.merge({
        level: payload.level,
        hoots: farmState.hoots,
        energy: farmState.energy
      }).save()

      return response.ok(await getMiningFarmResponse(miningFarmUpdated))
    } else {
      return response.notFound({ message: 'Mining farm not found' })
    }
  }

  async energy({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const payload = await request.validateUsing(UpgradeEnergyValidator)

    const miningFarms = await MiningFarm.query()
      .whereHas('user', (query) => {
        query.where('id', user.id)
      })
    if (miningFarms.length > 0) {
      let miningFarm: MiningFarm = miningFarms[0];

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

      // let wasZeroEnergy = false;
      // if (miningFarm.energy === 0) {
      //   wasZeroEnergy = true;
      // }

      try {
        farmLogic.setEnergy(payload.energy, payload.timestamp)
      } catch (e) {
        if (e.message === 'Insufficient funds to upgrade energy.' || e.message === 'Energy upgrade exceeds the limit.') {
          return response.notAcceptable({message: e.message})
        } else {
          throw e
        }
      }

      const farmState = farmLogic.getState()
      const updatedData = {
        energy: farmState.energy,
        hoots: farmState.hoots,
        autoMiningStart: farmState.autoMining.startTime,
        autoMiningEnd: farmState.autoMining.endTime,
        lastTimestamp: payload.timestamp,
      };

      // if (wasZeroEnergy) {
      //   updatedData.lastTimestamp = payload.timestamp;
      // }
      const miningFarmUpdated = await miningFarm.merge(updatedData).save()

      return response.ok(await getMiningFarmResponse(miningFarmUpdated))
    } else {
      return response.notFound({ message: 'Mining farm not found' })
    }
  }
}
