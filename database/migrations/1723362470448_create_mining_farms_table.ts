import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'mining_farms'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.integer('level').notNullable()
      table.decimal('energy').notNullable()
      table.decimal('temperature').notNullable()
      table.decimal('hoots').nullable()
      table.bigint('last_timestamp').nullable()

      table.boolean('auto_mining_enabled').notNullable().defaultTo(false)
      table.integer('auto_mining_duration').nullable()
      table.bigint('auto_mining_start').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
