import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'event_statuses'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('last_visited_at').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('last_visited_at')
    })
  }
}
