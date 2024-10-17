import { DateTime } from 'luxon'
import {BaseModel, column, hasMany} from '@adonisjs/lucid/orm'
import EventStatus from "#models/event_status";
import type {HasMany} from "@adonisjs/lucid/types/relations";

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @hasMany(() => EventStatus)
  public eventStatuses: HasMany<typeof EventStatus>

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare slug: string

  @column()
  declare bonusDescription: string

  @column()
  declare repeat: string

  @column()
  declare repeatParam1: string

  @column()
  declare repeatParam2: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
