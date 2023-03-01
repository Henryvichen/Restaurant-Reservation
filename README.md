# Restaurant Reservation Application

This is an application for restaurants to allows users to create, update, view, delete reservations, as well as seat them at various tables within the restaurant.

### Technologies:

[![postgresql](https://cdn.iconscout.com/icon/free/png-256/postgresql-11-1175122.png)](https://www.postgresql.org/) 
[![react](https://cdn.iconscout.com/icon/free/png-256/react-1-282599.png)](https://reactjs.org/)
[![expressjs](https://hackr.io/tutorials/learn-express-js/logo/logo-express-js?ver=1557508379)](https://expressjs.com/)
[![nodejs](https://cdn.iconscout.com/icon/free/png-256/node-js-1174925.png)](https://nodejs.org/en/)


### Installation Instructions:

1. Fork and clone this repository.
2. Run `cp ./back-end/.env.sample ./back-end/.env`
3. Update the `./back-end/.env` file with the connection URL's to your database instance. (ElephantSQL is great)
4. Run `cp ./front-end/.env.sample ./front-end/.env` (Do not need to make changes to `.front-end/.env`)
5. Run `npm install` in root folder to install all dependencies.
6. Run `npm run start:dev` to start the server in development mode.

#### Reservations endpoints:

## API

| Route       | Get         | Put        | Post         | Delete       |      
| ----------- | ----------- | ---------- | ------------ | ------------ |
| ```/reservations```      | ✅      |❌      | ✅    |       ❌       |
| ```/reservations/:reservation_id```   | ✅        | ✅       | ❌         | ❌         |
| ```/reservations/:reservation_id/status```      | ❌      |✅      | ❌    |       ❌       |
| ```/tables```   | ✅        | ❌       | ✅         | ❌         |
| ```/tables/:table_id```   | ✅        | ❌       | ❌         | ❌         |
| ```/tables/:table_id/seat```   | ❌        | ✅       | ❌         | ✅         |



