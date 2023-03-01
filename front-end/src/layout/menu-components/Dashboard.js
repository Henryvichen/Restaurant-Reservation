import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReservationList from "./reservation-components/ReservationList";
import ErrorAlert from "../ErrorAlert";
import {
  listReservations,
  listTables,
  clearFinishedTable,
  cancelReservation,
} from "../../utils/api";
import { today, previous, next } from "../../utils/date-time";
import useQuery from "../../utils/useQuery";
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

//Maybe an error handler for table, in case of no table?
function Dashboard() {
  const [date, setDate] = useState(today());
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservations([]);
    setReservationsError(null);
    setTables([]);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables(abortController.signal).then(setTables);
    return () => abortController.abort();
  }

  /**
   * Initialize the querydate, it will be null because on initial load there is nothing in the url.
   * Every time we click a button, there is a param change in the url
   * The queryDate is updated every time we click,
   * We use useEffect to observe the change in `queryDate`
   * When there is a change, we set the `date` to be the `queryDate`
   * We display `date` on the board
   */
  const query = useQuery();
  let queryDate = query.get("date");
  useEffect(dateChange, [queryDate]);

  function dateChange() {
    if (queryDate) {
      setDate(queryDate);
    } else setDate(today());
  }

  const handleClearTable = async (evt) => {
    try {
      if (
        window.confirm(
          "Is this table ready to seat new guests? This cannot be undone."
        )
      ) {
        const abortController = new AbortController();
        const tableId = evt.target.getAttribute("data-table-id-finish");
        await clearFinishedTable(tableId, abortController.signal);
        loadDashboard();
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        setReservationsError(error);
      } else return;
    }
  };

  const tableList = tables.map(
    ({ table_id, table_name, capacity, reservation_id }) => {
      return (
        <tr key={table_id}>
          <td>{table_id}</td>
          <td>{table_name}</td>
          <td>{capacity}</td>
          <td data-table-id-status={table_id}>
            {reservation_id === null ? "Free" : "Occupied"}
          </td>
          {reservation_id ? (
            <td>
              <button
                type="button"
                data-table-id-finish={table_id}
                className="btn btn-light"
                onClick={handleClearTable}
              >
                Finish
              </button>
            </td>
          ) : null}
        </tr>
      );
    }
  );

  const handleCancelClick = async (evt) => {
    try {
      if (
        window.confirm(
          "Do you want to cancel this reservation? This cannot be undone."
        )
      ) {
        const abortController = new AbortController();
        const reservation_id = evt.target.getAttribute(
          "data-reservation-id-cancel"
        );
        await cancelReservation(
          { status: "cancelled" },
          reservation_id,
          abortController.signal
        );
        loadDashboard();
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        setReservationsError(error);
      } else return;
    }
  };

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="col">
        <div className="overscroll">
          <div className="d-md-flex mb-3">
            <h4 className="mb-0">Reservations for {date}</h4>
          </div>
          <div className="btn-group">
            <Link
              className="btn btn-secondary"
              to={`/dashboard?date=${previous(date)}`}
            >
              <span className="oi oi-chevron-left"></span>
              &nbsp;Previous
            </Link>
            <Link
              className="btn btn-secondary"
              to={`/dashboard?date=${today()}`}
            >
              Today
            </Link>
            <Link
              className="btn btn-secondary"
              to={`/dashboard?date=${next(date)}`}
            >
              Next&nbsp;<span className="oi oi-chevron-right"></span>
            </Link>
          </div>
          <div className="table-responsive">
            <table className="table table-primary table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Date</th>
                  <th scope="col">Time</th>
                  <th scope="col">People</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                <ReservationList
                  reservations={reservations}
                  handleCancelClick={handleCancelClick}
                  renderStatus="strict"
                />
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="overscroll">
          <div className="table-responsive">
            <table className="table table-primary table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Table Name</th>
                  <th scope="col">Maximum Capacity</th>
                  <th scope="col">Availibility</th>
                </tr>
              </thead>
              <tbody>{tableList}</tbody>
            </table>
          </div>
        </div>
      </div>

      <ErrorAlert error={reservationsError} />
      {/* {JSON.stringify(reservations)} */}
    </main>
  );
}

export default Dashboard;
