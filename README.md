# Restaurant Reservation Application

This is an application for restaurants to allows users to create, update, view, delete reservations, as well as seat them at various tables within the restaurant.

### Technologies:

[![postgresql](https://cdn.iconscout.com/icon/free/png-256/postgresql-11-1175122.png)](https://www.postgresql.org/) 
[![react](https://cdn.iconscout.com/icon/free/png-256/react-1-282599.png)](https://reactjs.org/)
[![expressjs](https://hackr.io/tutorials/learn-express-js/logo/logo-express-js?ver=1557508379)](https://expressjs.com/)
[![nodejs](https://cdn.iconscout.com/icon/free/png-256/node-js-1174925.png)](https://nodejs.org/en/)

# Tutorial Screenshots:

## Create Reservation
![New Reservation SS](https://i.gyazo.com/c4057147b7deae532be14b13ba9d2207.png)
Allow user to create a new Reservation. 

## Create Table
![New Table SS](https://i.gyazo.com/071e9015af1c09f4af145ce156ffced9.png)
Allow user to create new Table.

## Dashboard
![Dashboard SS](https://i.gyazo.com/c718d083bfbbb96bef0afe6dd14a7555.png)
The dashboard displays all reservations schedule for the date specified, along with all of the tables.
If no date is given, it will automatically give today's date.

Reservations can be seated, edited, or cancelled here.

## Seat Reservation
![Seat SS](https://i.gyazo.com/bb65238d7a19f0452daa61b2d6a05a6d.png)
Choose a table and click submit to seat the reservation.

## Search Reservation
![Search SS](https://i.gyazo.com/d6aa3ed24e454181437118f42680573e.png)
Search for reservation by phone number.

## Edit Reservation
![Edit SS](https://i.gyazo.com/4cfa861fdc0ced8550177b3bce2c6676.png)
Edit a reservation if any information needs to be updated.

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



