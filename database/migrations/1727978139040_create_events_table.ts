import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.text('title').notNullable()
      table.text('description').notNullable()
      table.string('slug', 1024).notNullable()
      table.text('bonus_description').notNullable()
      table.string('repeat', 1024).nullable()
      table.string('repeat_param_1', 1024).nullable()
      table.string('repeat_param_2', 1024).nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
