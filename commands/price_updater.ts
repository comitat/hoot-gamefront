import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import pairsConfig from '#config/price_updater'
import axios from 'axios'
import PairPrice from '#models/pair_price'
import env from '#start/env'

// node ace price:updater
// or
// node priceUpdater.cjs
export default class PriceUpdater extends BaseCommand {
  static commandName = 'price:updater'
  static description = 'Daemon process to update prices'
  static POLL_INTERVAL = env.get('PRICE_UPDATER_POLL_INTERVAL') || 5000

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('Starting price updater daemon')

    const pollDedust = async () => {
      this.logger.info('Polling dedust.io for prices')

      for (const pair of pairsConfig.pairs) {
        try {
          const response = await axios.get(`https://api.dedust.io/v2/pools/${pair.pool}/trades`)
          const trades = response.data

          if (trades.length === 0) {
            this.logger.warn(`No trades found for pool ${pair.pool}`)
            continue
          }

          const lastTrade = trades[trades.length - 1]
          let price;
          console.log(lastTrade)
          if (lastTrade.assetIn.type === "jetton") {
            price = parseFloat(lastTrade.amountOut) / parseFloat(lastTrade.amountIn)
          } else if (lastTrade.assetOut.type === "native") {
            price = parseFloat(lastTrade.amountIn) / parseFloat(lastTrade.amountOut)
          }

          await PairPrice.updateOrCreate(
            { tokenFrom: pair.tokenFrom, tokenTo: pair.tokenTo },
            { price: price.toString() }
          )

          this.logger.info(`Updated price for pool ${pair.pool}: ${price}`)
        } catch (error) {
          this.logger.error(`Failed to update price for pool ${pair.pool}: ${error.message}`)
        }
      }

      this.logger.info('Price update completed')
    }

    // Set interval to poll every 5 seconds
    setInterval(async () => {
      await pollDedust()
    }, PriceUpdater.POLL_INTERVAL)
  }
}
