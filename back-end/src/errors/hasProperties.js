/**
 * Creates a middleware function that validates the req.body.data has the specified properties.
 * @param properties
 * one or more property name strings.
 * @return {function(*,*,*): void}
 * a middleware function that validates the req.body.data has the specified properties.
 */
function hasProperties(...properties) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    try {
      properties.forEach((property) => {
        const value = data[property];
        if (!value) {
          const error = new Error(`A '${property}' property is required`);
          error.status = 400;
          throw error;
        }
      });
      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = hasProperties;
