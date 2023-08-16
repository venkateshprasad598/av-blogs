const errorHandlerMiddleWare = (err, req, res, next) => {
  console.log(err);
  return res.status(404).json({ msg: "sometging went wrong" });
};
module.exports = errorHandlerMiddleWare;
