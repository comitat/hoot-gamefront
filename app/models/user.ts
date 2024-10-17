import { DateTime } from 'luxon'
import {BaseModel, column, hasMany, hasOne} from '@adonisjs/lucid/orm'
import Account from "#models/account";
import type {HasMany, HasOne} from "@adonisjs/lucid/types/relations";
import MiningFarm from "#models/mining_farm";
import Farming from "#models/farming";
import EventStatus from "#models/event_status";

export default class User extends /*compose(*/BaseModel/*, AuthFinder)*/ {
  @column({ isPrimary: true })
  declare id: number

  @hasOne(() => Account)
  public account: HasOne<typeof Account>

  @hasOne(() => MiningFarm)
  public miningFarm: HasOne<typeof MiningFarm>

  @hasMany(() => Farming)
  public farmings: HasMany<typeof Farming>

  @hasMany(() => EventStatus)
  public eventStatuses: HasMany<typeof EventStatus>

  @column()
  declare tgId: string

  @column()
  declare username: string | null

  @column()
  declare firstName: string | null

  @column()
  declare lastName: string | null

  @column()
  declare languageCode: string | null

  @column()
  declare pubKey: string | null

  @column()
  declare nbAddress: string | null

  @column()
  declare isPremium: boolean | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

}
