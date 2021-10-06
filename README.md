# building-cloud-integrations

Written by Michael Meier and Lucas Aebi 


## Usage

Start the server:

```bash
npm run dev
# or
SECRET="secret" npm run server
# or
SECRET="secret" node index.js
```

To run the test
```bash
SECRET="secret" npx mocha
# or 
npm run test
```

Alternatively set $SECRET yourself and run `npm run server` / `npm run test`

**Note:** these commands work on Linux and Mac only. On Windows use the following instead 
but be aware that using this method no SECRET is provided to the app and a default value 
will be used ("this is not a secret").  

## Online Server

[https://cloud-integrations-api.herokuapp.com](https://cloud-integrations-api.herokuapp.com)

## API Documentation

[https://meierag.stoplight.io/docs/GradedExercise/YXBpOjIyOTk2MDA3-web-shop](https://meierag.stoplight.io/docs/GradedExercise/YXBpOjIyOTk2MDA3-web-shop)
