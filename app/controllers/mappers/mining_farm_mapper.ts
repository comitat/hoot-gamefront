import MiningFarm from "#models/mining_farm";
import EventStatus from "#models/event_status";



export const getMiningFarmResponse = async (miningFarm: MiningFarm, bonusEnergyValue: number | undefined) => {
  await miningFarm.load('user')

  const response = miningFarm.serialize({
    fields: {
      omit: ['userId'],
    },
    relations: {
      user: {
        fields: {
          omit: ['id'],
        },
      },
    },
  })

  const ret = {
    ...response,
    user: {
      ...response.user,
    }
  }

  if (bonusEnergyValue) {
    ret.bonusEnergyValue = bonusEnergyValue
  }

  return ret
}
