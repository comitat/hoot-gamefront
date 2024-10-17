import vine from '@vinejs/vine'

export const GenAddressValidator = vine.compile(
  vine.object({
    pubKey: vine.string(),
  })
)

