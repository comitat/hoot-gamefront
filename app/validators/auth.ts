import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    initData: vine.object({
      user: vine.object({
        id: vine.number(),
        username: vine.string().minLength(0).maxLength(1024).optional(),
        first_name: vine.string().minLength(0).maxLength(1024).optional(),
        last_name: vine.string().minLength(0).maxLength(1024).optional(),
        language_code: vine.string().minLength(2).maxLength(2).optional(),
        // isPremium: vine.boolean().optional(),
      })
    })
  })
)


