# NodeApp

Install dependendecies.

```js
npm install
```

Copy .env.example to .env and customize your configuration.

```sh
cp .env.example .env
```

Initilize the database:

* Warning, the next command deletes all contents of the database!!!!

```sh
npm run init-db
```

## Development

To start the application in development mode use:

```js
npm run dev
```

## API

Agent list

GET /api/agentes

```json
{
    "results": [
        {
            "_id": "65d4fe2e3a2e6e79c59aaaae",
            "name": "Smith",
            "age": 34
        },
    ]
}
```