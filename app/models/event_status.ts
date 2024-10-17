import { DateTime } from 'luxon'
import {BaseModel, belongsTo, column} from '@adonisjs/lucid/orm'
import User from "#models/user";
import Event from "#models/event";
import type {BelongsTo} from "@adonisjs/lucid/types/relations";

export default class EventStatus extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user', serializeAs: 'user' })
  public userId: number

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  public user: BelongsTo<typeof User>

  @column({ columnName: 'event', serializeAs: 'event' })
  public eventId: number

  @belongsTo(() => Event, {
    foreignKey: 'eventId',
  })
  public event: BelongsTo<typeof Event>

  @column()
  declare status: string

  @column()
  declare param1: string

  @column()
  public lastVisitedAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
