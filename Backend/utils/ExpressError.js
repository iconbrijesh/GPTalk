class ExpressError extends Error {
  constructor(
    status,
    message = "Something went wrong",
    error = [],
    stack = ""
  ) {
    super(message);  // pass message to Error class
    this.status = status;
    this.data = null;
    this.success = false;
    this.error = error;

    if (stack) {
      this.stack = stack;  // optional custom stack trace
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ExpressError };
