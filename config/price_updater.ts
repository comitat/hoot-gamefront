import { defineConfig } from '@adonisjs/core/http'

const pairs = defineConfig({
  pairs: [
    {ticker: "TONUSDT", tokenFrom: "TON", tokenTo: "USDT", pool: "EQDcm06RlreuMurm-yik9WbL6kI617B77OrSRF_ZjoCYFuny"},
    {ticker: "HOOTUSDT", tokenFrom: "HOOT", tokenTo: "USDT", pool: "EQDcm06RlreuMurm-yik9WbL6kI617B77OrSRF_ZjoCYFuny"}
  ]
})

export default pairs
