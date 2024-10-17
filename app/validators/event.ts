import vine from '@vinejs/vine'

export const TriggerEventValidator = vine.compile(
  vine.object({
  })
)

export const GetEventValidator = vine.compile(
  vine.object({
  })
)

export const DailyEventValidator = vine.compile(
    vine.object({
      timestamp: vine.number(),
    })
)
