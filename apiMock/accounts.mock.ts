const BASE_URL = '/api/accounts';

const mocks = [
    {
        pattern: BASE_URL,
        method: 'GET',
        handle: (req, res) => {
          res.end(JSON.stringify({
            success: true,
            data: [
                {
                    id: 1,
                    name: 'USDT',
                    amount: '120.127',
                    usdValue: '1.00',
                },
                {
                    id: 2,
                    name: 'TON',
                    amount: '10.832',
                    usdValue: '7.04',
                },
                {
                    id: 3,
                    name: 'HOOT',
                    amount: '57.011',
                    usdValue: '0.06',
                },
            ],
          }));
        },
    },
    {
      pattern: `${BASE_URL}/transactions`,
      method: 'GET',
      handle: (req, res) => {
        res.end(JSON.stringify({
          success: true,
          data: [
              {
                  id: 1,
                  name: 'USDT > HOOT',
                  status: 'successful',
                  dateTime: '01/01/2100',
                  details: '-',
              },
              {
                  id: 2,
                  name: 'USDT > TON',
                  status: 'successful',
                  dateTime: '02/01/2100',
                  details: '-',
              },
          ],
        }));
      },
    },
    {
        pattern: `${BASE_URL}/swap`,
        method: 'POST',
        handle: (req, res) => {
            const isSuccess = Math.random() > 0.5;
          res.end(JSON.stringify({
            success: isSuccess,
            error: isSuccess
                ? null
                : {
                    code: 400,
                    message: 'Sorry, bad request',
                },
          }));
        },
    },
];

export default mocks;