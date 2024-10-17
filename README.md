# Local run

```bash
nvm use 20.14
npm i
node ace migration:run
npm run dev
```

Reset DB
  
```bash
node ace migration:reset
```  

# Register new user 

POST /user/register

```json
{
  "initData": {
    "query_id": "AAFWIa8LAAAAAFYhrwsNbQkz",
    "user": {
      "id": 196026710,
      "first_name": "Igor",
      "last_name": "Belyaletdinov",
      "username": "igorbel",
      "language_code": "en",
      "allows_write_to_pm": true
    },
    "auth_date": "1723566344",
    "hash": "c9c00d5b1f5aaa20ce4af0e304fc9b928750fa6da81c4453639182509ac2068d"
  }
}
```

Response sample 

```json
{
  "token": {
    "type": "bearer",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcyMzU2NzAxN30.7wzDNwxrNWJkELQg5iaNrnd4jPlMbMDcElKcKnI84SU",
    "expiresIn": ""
  },
  "tgId": 196026710,
  "username": "igorbel",
  "firstName": "Igor",
  "lastName": "Belyaletdinov",
  "languageCode": "en",
  "createdAt": "2024-08-13T16:36:57.179+00:00",
  "updatedAt": "2024-08-13T16:36:57.179+00:00",
  "id": 1
}
```

# Get current user 

GET /me

# Initial init

POST /mining/init

```json
{
  "timestamp": "<current timestamp in ms>"
}
```

# Send taps 

POST /mining/tap

```json
{
  "timestamp": "<current timestamp in ms>",
  "count": 200
}
```

# Start auto mining

POST /mining/auto:start

```json
{
  "timestamp": "<current timestamp in ms>",
  "duration": 3
}
```

# Stop auto mining

POST /mining/auto:stop

```json
{
  "timestamp": "<current timestamp in ms>"
}
```

# Upgrade level

POST /upgrade/level

```json
{
  "level": 2
}
```

# Upgrade energy

POST /upgrade/energy

```json
{
  "energy": 200,
  "timestamp": "<current timestamp in ms>"
}
```

# Farming
## Create

POST /farming/create

```json
{
  "token": "HOOT",
  "amount": 100,
  "eventSlug": "start-farming-50-hoot | start-farming-500-hoot | daily-bonus"
}
```

## Get all 

POST /farming/get

```json
{
  "isActive": true,
  "isEnded": true
}
```
or to get all
```
{
}
```

## Stop

GET /farming/stop/<uuid>

## Status

GET /farming/status/<uuid>

# Events

## Evaluate bonus for daily event



GET /event/daily/eval

## Claim energy bonus for daily event

POST /event/daily/claim

```json
{
  "timestamp": "<current timestamp in ms>"
}
```

## Get all event statuses for user

GET /event/statuses

## Generate non-bounceable TON address

POST /user/wallet/address/generate

```json
{
  "pubKey": "<TON HEX address>"
}
```
