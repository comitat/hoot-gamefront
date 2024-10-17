import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'farmings'

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

      table.uuid('farm_id').notNullable().unique()
      table.timestamp('started_at')
      table.timestamp('ended_at').nullable()
      table.string('token', 255).nullable()
      table.decimal('amount').nullable()
      table.integer('percentage').nullable()
      table.boolean('is_active').defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
