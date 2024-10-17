import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.bigint('tg_id').notNullable().unique()
      table.string('username', 1024).nullable()
      table.string('first_name', 1024).nullable()
      table.string('last_name', 1024).nullable()
      table.string('language_code', 1024).nullable()
      table.boolean('is_premium').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
