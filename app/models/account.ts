import { DateTime } from 'luxon'
import {BaseModel, belongsTo, column} from '@adonisjs/lucid/orm'
import User from "#models/user";
import type {BelongsTo} from "@adonisjs/lucid/types/relations";

export default class Account extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user', serializeAs: 'user' })
  public userId: number

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  public user: BelongsTo<typeof User>

  @column()
  declare hoot: number

  @column()
  declare ton: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
