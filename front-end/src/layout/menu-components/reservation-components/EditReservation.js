import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../../ErrorAlert";
import { readReservation, editReservation } from "../../../utils/api";
import { validateReservationDateTime } from "../../../utils/date-time";

/**
 * This component takes the user to the Edit page of the Reservation to edit information of the reservation.
 * @returns {JSX.Element}
 */
function EditReservation() {
  const history = useHistory();
  const { resId } = useParams();

  const initialFormInfo = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };
  const [reservationInfo, setReservationInfo] = useState(initialFormInfo);
  const [errors, setErrors] = useState(null);
  const [frontEndErrors, setFrontEndErrors] = useState([]);

  useEffect(loadSeatPage, [resId]);
  function loadSeatPage() {
    const abortController = new AbortController();

    readReservation(resId, abortController.signal)
      .then(setReservationInfo)
      .catch(setErrors);
    return () => abortController.abort();
  }

  //Validate dates prior to sending the form
  const validateResDateTime = () => {
    const errorsArray = validateReservationDateTime(reservationInfo);
    //If there is any error, set the error objects and render the error instead of submitting form
    if (errorsArray.length === 0) {
      return true;
    } else {
      setFrontEndErrors(errorsArray);
      return false;
    }
  };

  //Create element to display errors on the CreateReservation component
  //If index is not acceptable, use unique number generator: measuring time from current/present date in millisecond
  const reservationErrorsList = () => {
    let temp = Date.now();
    return frontEndErrors.map((error) => {
      temp = temp + 1;
      return <ErrorAlert key={temp} error={error} />;
    });
  };

  //Send the edited reservation info to the express server
  const handleEditReservation = async (evt) => {
    evt.preventDefault();
    setErrors(null);
    try {
      const abortController = new AbortController();
      if (validateResDateTime()) {
        await editReservation(
          {
            ...reservationInfo,
            people: parseInt(reservationInfo.people),
          },
          abortController.signal
        );
        history.push(`/dashboard?date=${reservationInfo.reservation_date}`);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        setErrors(error);
      } else return;
    }
  };

  //Go back to the previous page or to the dashboard after clicking cancel
  const onCancel = () => {
    setReservationInfo(initialFormInfo);
    if (history.length > 1) {
      history.goBack();
    } else history.push("/");
  };

  return (
    <main>
      <h1>Edit Reservation</h1>
      {errors ? <ErrorAlert key={Date.now()} error={errors} /> : null}

      {frontEndErrors.length > 0 ? reservationErrorsList() : null}
      <ReservationForm
        onSubmit={handleEditReservation}
        onCancel={onCancel}
        reservationInfo={reservationInfo}
        setReservationInfo={setReservationInfo}
        submitLabel="Submit"
        cancelLabel="Cancel"
      />
    </main>
  );
}

export default EditReservation;
