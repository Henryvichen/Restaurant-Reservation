import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ReservationForm from "./reservation-components/ReservationForm";
import ErrorAlert from "../ErrorAlert";
import { createReservations } from "../../utils/api";
import { validateReservationDateTime } from "../../utils/date-time";

/**
 * This component display a page for the user to create a new reservation and allows user to submit it
 * @returns {JSX.Element}
 */
function CreateReservation() {
  const history = useHistory();

  const initialFormInfo = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };
  const [reservationInfo, setReservationInfo] = useState(initialFormInfo);
  const [errors, setErrors] = useState([]);

  //Validate dates prior to sending the form
  const validateResDateTime = () => {
    const errorsArray = validateReservationDateTime(reservationInfo);
    //If there is any error, set the error objects and render the error instead of submitting form
    if (errorsArray.length === 0) {
      return true;
    } else {
      setErrors(errorsArray);
      return false;
    }
  };

  //Create element to display errors on the CreateReservation component
  //If index is not acceptable, use unique number generator: measuring time from current/present date in millisecond
  const reservationErrorsList = () => {
    let temp = Date.now();
    return errors.map((error) => {
      temp = temp + 1;
      return <ErrorAlert key={temp} error={error} />;
    });
  };

  //Send the reservation info to the express server
  const handleCreateReservations = async (evt) => {
    evt.preventDefault();
    setErrors([]);
    try {
      const abortController = new AbortController();
      if (validateResDateTime()) {
        await createReservations(
          {
            ...reservationInfo,
            people: parseInt(reservationInfo.people),
          },
          abortController.signal
        );
        setReservationInfo(initialFormInfo);
        history.push(`/dashboard?date=${reservationInfo.reservation_date}`);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        setErrors([...errors, error]);
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
      <h1>Create Reservation</h1>
      {errors.length > 0 ? reservationErrorsList() : null}
      <ReservationForm
        onSubmit={handleCreateReservations}
        onCancel={onCancel}
        reservationInfo={reservationInfo}
        setReservationInfo={setReservationInfo}
        submitLabel="Submit"
        cancelLabel="Cancel"
      />
    </main>
  );
}

export default CreateReservation;
