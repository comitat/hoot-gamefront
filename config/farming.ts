import {defineConfig} from '@adonisjs/core/http'

const farming = defineConfig({
  percentage:
    {TON: 12, USDT: 12, HOOT: 25},
  events: {
    'start-farming-50-hoot': {
      hoot: {
        addPercentage: 50,
      }
    },
    'start-farming-500-hoot': {
      hoot: {
        addPercentage: 50,
      }
    }
  }
})

export default farming
