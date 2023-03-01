const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

/**
 * Middlewares for the POST request
 */
function validateTableName(req, res, next) {
  const { data: { table_name } = {} } = req.body;
  if (table_name.length < 2) {
    return next({
      status: 400,
      message: `table_name must be more than 1 character`,
    });
  }
  next();
}

function validateCapacityIsANumber(req, res, next) {
  const { data: { capacity } = {} } = req.body;
  if (typeof capacity !== "number") {
    return next({
      status: 400,
      message: `capacity must be a number`,
    });
  }
  next();
}

/**
 * Middlewares for the the PUT request
 */
async function validateReservationExists(req, res, next) {
  const {
    data: { reservation_id },
  } = req.body;
  const reservation = await service.readReservation(reservation_id);

  if (!reservation) {
    return next({
      status: 404,
      message: `reservation_id: ${reservation_id} does not exist.`,
    });
  }
  res.locals.reservation = reservation;
  next();
}

//validation of the table
async function validateTableExists(req, res, next) {
  const { table_id } = req.params;
  const tableRow = await service.readTable(table_id);
  if (!tableRow) {
    return next({
      status: 404,
      message: `${table_id} does not exist.`,
    });
  }
  res.locals.table = tableRow;
  next();
}

//see if table can fit party
function validateTableCapacity(req, res, next) {
  const reservation = res.locals.reservation;
  const table = res.locals.table;

  if (reservation.people > table.capacity) {
    return next({
      status: 400,
      message: "Table does not have sufficient capacity",
    });
  }
  next();
}

//check if table is occupied
function validateIfTableIsOccupied(req, res, next) {
  const table = res.locals.table;
  if (table.reservation_id) {
    return next({
      status: 400,
      message: "Table is occupied",
    });
  }
  next();
}

//check if party is seated
function validateReservationStatus(req, res, next) {
  const reservation = res.locals.reservation;
  if (reservation.status === "seated") {
    return next({
      status: 400,
      message: "Reservation is already seated",
    });
  }
  next();
}

/**
 * Middlewares for the DELETE request
 */
function validateIfTableIsNotOccupied(req, res, next) {
  const table = res.locals.table;
  if (!table.reservation_id) {
    return next({
      status: 400,
      message: "Table is not occupied",
    });
  }
  next();
}

/**
 * List handler for table resources
 */
async function list(req, res) {
  const tableList = await service.list();
  res.json({ data: tableList });
}
/**
 * Post handler for creating a table in the database
 */
async function create(req, res) {
  const { data } = req.body;
  const createdTable = await service.create(data);
  res.status(201).json({ data: createdTable });
}
/**
 * Put handler for updating the two tables in the database
 */
async function updateTable(req, res) {
  const { data: { reservation_id } = {} } = req.body;
  const { table_id } = req.params;
  const updatedTables = await service.updateTables({
    reservation_id,
    table_id,
  });
  res.json({ data: updatedTables });
}
/**
 * Delete handler for clearing out finished tables
 */

async function clearFinishedTable(req, res) {
  const table = res.locals.table;
  const clearedTables = await service.clearFinishedTable(
    table.table_id,
    table.reservation_id
  );
  res.json({ data: clearedTables });
}



module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasProperties("table_name"),
    hasProperties("capacity"),
    validateTableName,
    validateCapacityIsANumber,
    asyncErrorBoundary(create),
  ],
  update: [
    hasProperties("reservation_id"),
    asyncErrorBoundary(validateReservationExists),
    asyncErrorBoundary(validateTableExists),
    validateTableCapacity,
    validateIfTableIsOccupied,
    validateReservationStatus,
    asyncErrorBoundary(updateTable),
  ],
  delete: [
    asyncErrorBoundary(validateTableExists),
    validateIfTableIsNotOccupied,
    asyncErrorBoundary(clearFinishedTable),
  ],
};
