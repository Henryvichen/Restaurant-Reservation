import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "./menu-components/Dashboard";
import CreateReservation from "./menu-components/CreateReservation";
import Seat from "./menu-components/reservation-components/Seat";
import EditReservation from "./menu-components/reservation-components/EditReservation";
import CreateTable from "./menu-components/CreateTable";
import Search from "./menu-components/Search";
import NotFound from "./NotFound";

/**
 * Defines all the routes for the application.
 * @returns {JSX.Element}
 */

function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
      <Route path="/reservations/new">
        <CreateReservation />
      </Route>
      <Route path="/reservations/:resId/seat">
        <Seat />
      </Route>
      <Route path="/reservations/:resId/edit">
        <EditReservation />
      </Route>
      <Route path="/tables/new">
        <CreateTable />
      </Route>
      <Route path="/search">
        <Search />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
