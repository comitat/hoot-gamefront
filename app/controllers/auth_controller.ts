import type {HttpContext} from '@adonisjs/core/http'
import User from '#models/user'
import {registerValidator} from '#validators/auth'
import crypto from "crypto";
import env from '#start/env'
import Account from "#models/account";

export default class AuthController {

  isTgAuth(request: any) {
    const { hash, ...rest } = request.input('initData');
    function replaceNulls(obj) {
      for (let key in obj) {
        if (obj[key] === null) {
          obj[key] = "";
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          replaceNulls(obj[key]);
        }
      }
    }
    replaceNulls(rest);
    const dataCheckString = Object.entries(rest).sort().map(([k, v]) => {
      if (typeof v === "object" && v !== null) {
        v = JSON.stringify(v);
      }
      return `${k}=${v}`;
    }).join("\n");

    const secret = crypto.createHmac("sha256", "WebAppData").update(env.get('TG_BOT_API_TOKEN') ?? "");
    const calculatedHash = crypto.createHmac("sha256", secret.digest()).update(dataCheckString).digest("hex");

    return calculatedHash === hash;
  }

  async register({request, auth, response}: HttpContext) {

    if (!this.isTgAuth(request)) {
      return response.badRequest({message: 'Invalid signature'})
    }

    const payload = await request.validateUsing(registerValidator)

    const users = await User.query().where('tg_id', payload.initData.user.id)

    let user = null;
    if (users.length === 0) {
      user = await User.create({
        tgId: payload.initData.user.id,
        username: payload.initData.user.username,
        firstName: payload.initData.user.first_name,
        lastName: payload.initData.user.last_name,
        languageCode: payload.initData.user.language_code
      })
    } else {
      user = users[0]
    }

    let account = await user.related('account').query().first()
    if (!account) {
      const payloadDefault = {
        hoot: 0,
        ton: 0
      }
      await Account.create({...payloadDefault, userId: user.id})
    }

    const token = await auth.use('jwt').generate(user)
    return response.ok({
      token: token,
      ...user.serialize(),
    })
  }

}
