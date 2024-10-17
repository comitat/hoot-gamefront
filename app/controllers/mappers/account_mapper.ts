import Account from "#models/account";
import PairPrice from "#models/pair_price";

export const getAccountResponse = async (account: Account, pairPrices: PairPrice[]) => {
  await account.load('user')

  const response = account.serialize({
    fields: {
      omit: ['userId'],
    },
    relations: {
      user: {
        fields: {
          omit: ['id'],
        },
      },
    },
  })

  return {
    ...response,
    user: {
      ...response.user,
    },
    pairPrices: pairPrices.flatMap((pairPrice) => {
      return [
        {
          tokenFrom: pairPrice.tokenFrom,
          tokenTo: pairPrice.tokenTo,
          price: pairPrice.price,
          updatedAt: pairPrice.updatedAt,
        },
        {
          tokenFrom: pairPrice.tokenTo,
          tokenTo: pairPrice.tokenFrom,
          price: (1 / parseFloat(pairPrice.price)).toString(),
          updatedAt: pairPrice.updatedAt,
        }
      ]
    }),
  }
}
