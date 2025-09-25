
const { Signup, Login } = require('../controllers/AuthController');
const { userVerification } = require("../Middlewares/AuthMiddleware.js");
const router = require("express").Router();


router.post("/signup", Signup);
router.post('/login', Login);
router.get("/verify", userVerification, (req, res) => {
  // at this point, req.user is available
  res.json({ status: true, user: req.user.username });
});



module.exports = router;
