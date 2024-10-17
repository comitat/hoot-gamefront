import type {HttpContext} from '@adonisjs/core/http'

import { getAccountResponse } from "#controllers/mappers/account_mapper";
import Account from "#models/account";
import MiningFarm from "#models/mining_farm";
import PairPrice from "#models/pair_price";


export default class AccountController {
  async get({request, response, auth}: HttpContext) {
    const user = auth.getUserOrFail()

    let account = await user.related('account').query().first()
    let miningFarm = await user.related('miningFarm').query().first()
    const pairPrices = await PairPrice.query().orderBy('id', 'desc');
    if (!account) {
      const payloadDefault = {
        hoot: miningFarm.hoots,
        ton: 0
      }
      account = await Account.create({...payloadDefault, userId: user.id})
    } else {
      account = await account.merge({
        hoot: miningFarm.hoots
      }).save()
    }

    const accountResponse = await getAccountResponse(account, pairPrices)
    return response.ok(accountResponse)
  }
}
