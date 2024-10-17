import vine from '@vinejs/vine'

export const CreateFarmingValidator = vine.compile(
  vine.object({
    token: vine.string(),
    amount: vine.number(),
    eventSlug: vine.string().optional(),
  })
)

export const GetFarmingValidator = vine.compile(
  vine.object({
    isActive: vine.boolean().optional(),
    isEnded: vine.boolean().optional(),
  })
)
