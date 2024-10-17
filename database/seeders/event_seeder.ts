import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Event from "#models/event";

export default class extends BaseSeeder {
  async run() {
    const uniqueKey = 'id'

    await Event.updateOrCreateMany(uniqueKey, [
      {
        id: 1,
        title: 'Start farming 50 HOOT',
        description: 'Start farming 50 HOOT',
        slug: 'start-farming-50-hoot',
        bonus_description: '+50% APY to farming',
        repeat: 'once',
      },
      {
        id: 2,
        title: 'Start farming 500 HOOT',
        description: 'Start farming 500 HOOT',
        slug: 'start-farming-500-hoot',
        bonus_description: '+50% APY to farming',
        repeat: 'once',
      },
      {
        id: 3,
        title: 'Daily bonus',
        description: 'Daily bonus',
        slug: 'daily-bonus',
        bonus_description: '+50 kWtap',
        repeat: 'daily',
        repeat_param_1: '7',
        repeat_param_2: '50'
      },
    ])
  }
}
