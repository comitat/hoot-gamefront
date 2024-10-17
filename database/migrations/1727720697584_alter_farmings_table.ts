import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'farmings'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.decimal('amount_original').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('amount_original')
    })
  }
}
