const service = require("./reservations.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);


/**
 * Middleware validations for GET request
 */
async function reservationExists(req, res, next) {
  const resId = req.params.resId;
  const reservation = await service.read(resId);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: `Reservation ${resId} is not found.` });
}

/**
 * Middleware validations for a POST request
 */
//Check if reservation date is in a valid date format, YYYY-MM-DD

function validateResDate(req, res, next) {
  const dateRegex = /^20[2-9][0-9]-(0[0-9]|1[0-2])-([0-2][0-9]|3[0-1])$/;
  const { data: { reservation_date } = {} } = req.body;

  const today = new Date();
  const newResDate = new Date(reservation_date);
  if (
    !reservation_date ||
    !dateRegex.test(reservation_date) ||
    newResDate < today
  ) {
    return next({
      status: 400,
      message: `reservation_date must be present or future dates only`,
    });
  }
  next();
}

//Check if reservation date is a Tuesday
function validateResDateIsNotTuesday(req, res, next) {
  const { data: { reservation_date } = {} } = req.body;
  const dayOfTheWeek = new Date(reservation_date).getUTCDay();
  if (dayOfTheWeek === 2) {
    return next({
      status: 400,
      message: `the store is closed on tuesday`,
    });
  }
  next();
}

//Check if reservation time is in a valid time format and within 10:00 - 21:59
function validateResTime(req, res, next) {
  const hour24Regex = /^(1[0-9]|2[0-1]):[0-5][0-9]$/;
  const { data: { reservation_time } = {} } = req.body;
  let time = reservation_time.slice(0, 5);
  if (!time || !hour24Regex.test(time)) {
    return next({
      status: 400,
      message: `reservation_time must be a number within 23:59`,
    });
  }
  next();
}

//Check if the reservation time is in 10:30 - 21:30
function validateResTimeStrict(req, res, next) {
  const { data: { reservation_time, reservation_date } = {} } = req.body;
  const reservationDateTime = new Date(
    `${reservation_date}T${reservation_time}`
  );
  const resHour = reservationDateTime.getHours();
  const resMinutes = reservationDateTime.getMinutes();
  if (
    (resHour === 10 && resMinutes <= 29) ||
    resHour < 10 ||
    (resHour === 21 && resMinutes >= 31) ||
    resHour > 21
  ) {
    return next({
      status: 400,
      message: `reservation_time must be a number within 23:59`,
    });
  }
  next();
}

//Check if people is a number
function validatePeople(req, res, next) {
  const { data: { people } = {} } = req.body;
  if (!people || typeof people !== "number") {
    return next({
      status: 400,
      message: `people needs to be a number`,
    });
  }
  next();
}

//Check if mobile is a number
function validateNumber(req, res, next) {
  const { data: { mobile_number } = {} } = req.body;
  if (Number(mobile_number)>=0) { 
    return next(); 
  }
    next({
      status:400, message:'mobile number needed'
    })
}

//Check if there is a valid status property
function validateStatusIsValid(req, res, next) {
  const { data: { status } = {} } = req.body;
  if (status === "seated" || status === "finished") {
    return next({
      status: 400,
      message: `Status can't be seated or finished`,
    });
  }
  next();
}

/**
 * Middleware validations for the PUT update status request
 */
function validateEditStatusIsValid(req, res, next) {
  const {
    data: { status },
  } = req.body;
  const validStatuses = ["booked", "seated", "finished", "cancelled"];
  if (!validStatuses.includes(status)) {
    return next({
      status: 400,
      message: `Status cannot be ${status}`,
    });
  }

  if (res.locals.reservation.status === "finished") {
    return next({
      status: 400,
      message: `A finished reservation cannot be updated`,
    });
  }
  next();
}

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const { query } = req;
  let reservationList = null;
  if (query.mobile_number) {
    reservationList = await service.listByPhone(query.mobile_number);
  } else if (query.date) {
    reservationList = await service.list(query.date, "finished");
  }
  res.json({ data: reservationList });
}

/**
 * Read handler for a specified Reservation
 */
function read(req, res) {
  res.json({ data: res.locals.reservation });
}

/**
 * Post handler for creating new reservations
 */
async function create(req, res) {
  const newReservation = ({
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = req.body.data);
  const createdReservation = await service.create(newReservation);
  res.status(201).json({ data: createdReservation });
}

/**
 * Put handler for editing reservation
 */
async function editReservation(req, res) {
  const updateReservation = {
    ...res.locals.reservation,
    ...req.body.data,
  };
  const updatedRes = await service.updateReservation(updateReservation);
  res.json({ data: updatedRes });
}

/**
 * Put handler for updating the status of a reservation
 */
async function updateStatus(req, res) {
  const updateReservation = {
    ...res.locals.reservation,
    status: req.body.data.status,
  };
  const updatedRes = await service.updateNewStatus(updateReservation);
  res.json({ data: updatedRes });
}




module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), read],
  create: [
    hasRequiredProperties,
    validateResDate,
    validateResDateIsNotTuesday,
    validateResTime,
    validateResTimeStrict,
    validateNumber,
    validatePeople,
    validateStatusIsValid,
    asyncErrorBoundary(create),
  ],
  updateReservation: [
    asyncErrorBoundary(reservationExists),
    hasRequiredProperties,
    validateResDate,
    validateResDateIsNotTuesday,
    validateResTime,
    validateResTimeStrict,
    validateNumber,
    validatePeople,
    validateStatusIsValid,
    asyncErrorBoundary(editReservation),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    validateEditStatusIsValid,
    asyncErrorBoundary(updateStatus),
  ],
};
