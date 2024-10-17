import vine from '@vinejs/vine'

export const InitMiningFarmValidator = vine.compile(
  vine.object({
    timestamp: vine.number(),
  })
)

export const TapMiningFarmValidator = vine.compile(
  vine.object({
    timestamp: vine.number(),
    count: vine.number().min(0)
  })
)

export const StartAutoMiningFarmValidator = vine.compile(
  vine.object({
    timestamp: vine.number(),
    duration: vine.number().in([3, 6, 9])
  })
)

export const StopAutoMiningFarmValidator = vine.compile(
  vine.object({
    timestamp: vine.number(),
  })
)

export const UpgradeLevelValidator = vine.compile(
  vine.object({
    level: vine.number().min(2),
    timestamp: vine.number(),
  })
)

export const UpgradeEnergyValidator = vine.compile(
  vine.object({
    energy: vine.number(),
    timestamp: vine.number(),
  })
)
