import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'event_statuses'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('param_1', 1024).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('param_1')
    })
  }
}
