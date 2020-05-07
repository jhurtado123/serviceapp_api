var express = require('express');
const { checkIfLoggedIn } = require('../middlewares');

var router = express.Router();

router.use(checkIfLoggedIn);
/* GET home page. */
router.get('/', function(req, res, next) {
	res.status(200).json({
		demo: 'Welcome this route is protected',
  });
});

module.exports = router;
