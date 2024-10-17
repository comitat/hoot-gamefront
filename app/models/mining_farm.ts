import { DateTime } from 'luxon'
import {BaseModel, belongsTo, column} from '@adonisjs/lucid/orm'
import User from "#models/user";
import type {BelongsTo} from "@adonisjs/lucid/types/relations";

export default class MiningFarm extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user', serializeAs: 'user' })
  public userId: number

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  public user: BelongsTo<typeof User>

  @column()
  public level: number

  @column()
  declare energy: number

  @column()
  declare temperature: number

  @column()
  declare hoots: number

  @column()
  declare lastTimestamp: bigint

  @column()
  declare lastTapCount: number

  @column()
  declare autoMiningEnabled: boolean

  @column()
  declare autoMiningDuration: number | null

  @column()
  declare autoMiningStart: bigint | null

  @column()
  declare autoMiningEnd: bigint | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
