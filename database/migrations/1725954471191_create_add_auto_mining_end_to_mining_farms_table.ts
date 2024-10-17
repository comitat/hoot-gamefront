import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'mining_farms'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.bigint('auto_mining_end').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('auto_mining_end')
    })
  }
}
