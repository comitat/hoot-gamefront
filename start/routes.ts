import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import FarmingController from "#controllers/farming_controller";
import EventController from "#controllers/event_controller";
const AuthController = () => import('#controllers/auth_controller')
const TapController = () => import('#controllers/tap_controller')
const AutoMiningController = () => import('#controllers/auto_mining_controller')
const UpgradeController = () => import('#controllers/upgrade_controller')
const AccountController = () => import('#controllers/account_controller')
const WalletController = () => import('#controllers/wallet_controller')

router.group(() => {
  router.post('register', [AuthController, 'register'])
  router.post('wallet/address/generate', [WalletController, 'genAddress'])
    .use(middleware.auth())
}).prefix('user')

router.group(() => {
  router.post('init', [TapController, 'init'])
    .use(middleware.auth())
  router.post('tap', [TapController, 'tap'])
    .use(middleware.auth())
  router.post('auto:start', [AutoMiningController, 'start'])
    .use(middleware.auth())
  router.post('auto:stop', [AutoMiningController, 'stop'])
    .use(middleware.auth())
}).prefix('mining')

router.group(() => {
  router.post('level', [UpgradeController, 'level'])
    .use(middleware.auth())
  router.post('energy', [UpgradeController, 'energy'])
    .use(middleware.auth())
}).prefix('upgrade')

router.group(() => {
  router.post('get', [FarmingController, 'getAll'])
    .use(middleware.auth())
  router.post('create', [FarmingController, 'create'])
    .use(middleware.auth())
  router.get('stop/:id', [FarmingController, 'stop'])
    .use(middleware.auth())
  router.get('status/:id', [FarmingController, 'status'])
    .use(middleware.auth())
}).prefix('farming')

router.group(() => {
  router.get('statuses', [EventController, 'getAllStatuses'])
    .use(middleware.auth())
  router.get('daily/eval', [EventController, 'evalDailyBonus'])
    .use(middleware.auth())
  router.post('daily/claim', [EventController, 'claimDailyBonus'])
    .use(middleware.auth())
}).prefix('event')

router.group(() => {
  router.get('me', [AccountController, 'get'])
    .use(middleware.auth())
}).prefix('account')

router.get('me', async ({ auth, response }) => {
  try {
    const user = auth.getUserOrFail()
    return response.ok(user)
  } catch (error) {
    return response.unauthorized({ error: 'User not found' })
  }
})
.use(middleware.auth())
