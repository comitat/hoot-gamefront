import type { HttpContext } from '@adonisjs/core/http'
import {GenAddressValidator} from "#validators/wallet";
import TonWeb from "tonweb";

export default class WalletController {
  async genAddress({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const payload = await request.validateUsing(GenAddressValidator)

    // https://github.com/toncenter/tonweb/blob/master/test/wallet-example.html
    const tonweb = new TonWeb();
    const wallet = tonweb.wallet.create({address: payload.pubKey});
    const address = await wallet.getAddress();
    const nonBounceableAddress = address.toString(true, true, false);

    await user.merge({
      pubKey: payload.pubKey,
      nbAddress: nonBounceableAddress
    }).save()

    return response.ok({message: 'Address generated'})
  }


}
