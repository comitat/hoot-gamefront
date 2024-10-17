import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class PairPrice extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tokenFrom: string

  @column()
  declare tokenTo: string

  @column()
  declare price: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
