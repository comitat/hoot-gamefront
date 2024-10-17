import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'mining_farms'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.bigInteger('last_tap_count').notNullable().defaultTo(0)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('last_tap_count')
    })
  }
}
