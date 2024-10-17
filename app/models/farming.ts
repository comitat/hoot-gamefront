import { DateTime } from 'luxon'
import {BaseModel, belongsTo, column} from '@adonisjs/lucid/orm'
import User from "#models/user";
import type {BelongsTo} from "@adonisjs/lucid/types/relations";

export default class Farming extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user', serializeAs: 'user' })
  public userId: number

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  public user: BelongsTo<typeof User>

  @column()
  public farmId: string

  @column()
  public startedAt: DateTime

  @column()
  public endedAt: DateTime

  @column()
  public token: 'HOOT' | 'TON'

  @column()
  public amount: number

  @column()
  public amountOriginal: number

  @column()
  public percentage: number

  @column()
  public isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
