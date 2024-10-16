const BASE_URL = '/api/user';

const mocks = [
    {
        pattern: `${BASE_URL}/profile`,
        method: 'GET',
        handle: (req, res) => {
          res.end(JSON.stringify({
            success: true,
            data: {
                id: 1,
                name: 'Konstantin Konstantinopolsky',
                preferences: {
                    language: 'eng',
                    notifications: false,
                },
                services: [
                  {
                    id: 1,
                    name: 'Automining',
                    status: 'active',
                    description: '-',
                  },
                ],
                items: [
                  {
                    id: 1,
                    name: 'Level up',
                    description: '+ video card, + x2 farming income per hour',
                  },
                ],
            },
          }));
        },
    },
    {
        pattern: `${BASE_URL}/profile`,
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