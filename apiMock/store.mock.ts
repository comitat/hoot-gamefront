const BASE_URL = '/api/store';

const mocks = [
    {
      pattern: `${BASE_URL}/items`,
      method: 'GET',
      handle: (req, res) => {
        res.end(JSON.stringify({
          success: true,
          data: [
            {
              id: 1,
              name: 'Level up',
              description: '+ video card, + x2 farming income per hour',
              hootPrice: '0.3',
            },
            {
              id: 2,
              name: 'x2',
              description: 'x2 video card, + x4 farming income per hour',
              hootPrice: '0.57',
            },
          ],
        }));
      },
    },
    {
      pattern: `${BASE_URL}/services`,
      method: 'GET',
      handle: (req, res) => {
        res.end(JSON.stringify({
          success: true,
          data: [
            {
              id: 1,
              name: 'Automining',
              description: '-',
              hootHourPrice: '0.05',
            },
          ],
        }));
      },
    },
    {
      pattern: `${BASE_URL}/services/purchase`,
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
    {
        pattern: `${BASE_URL}/items/purchase`,
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