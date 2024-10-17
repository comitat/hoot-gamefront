import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pair_prices'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('token_from', 255).notNullable()
      table.string('token_to', 255).notNullable()
      table.string('price', 255).notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
