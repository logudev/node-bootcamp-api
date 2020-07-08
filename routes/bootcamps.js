const express = require('express');
const router = express.Router();

// Controller methods
const {
  getBootCamps,
  getBootCamp,
  getBootCampsInRadius,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
} = require('../controllers/bootcamps');

router.route('/').get(getBootCamps).post(createBootCamp);

router
  .route('/:id')
  .get(getBootCamp)
  .put(updateBootCamp)
  .delete(deleteBootCamp);

router.route('/radius/:zipcode/:distance').get(getBootCampsInRadius);

module.exports = router;
