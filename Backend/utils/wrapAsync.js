const wrapAsync = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};

export {wrapAsync };
