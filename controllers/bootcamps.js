const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const geocoder = require('../utils/geocoder');

// @desc    Get all the bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
// The 2 GET routes alone use an asyncHandler to avoid try catch.
// If you find comfortable, replace it in all controller methods.
exports.getBootCamps = asyncHandler(async (req, res, next) => {
  const reqQuery = { ...req.query };

  // Fields to exclude in query
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over the fields in query and delete the ones in removeFields
  removeFields.forEach((field) => delete reqQuery[field]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Modifying special operators like gte to have $ sign, query will be like ?averageCost[gte]=10000
  queryStr = queryStr.replace(
    /\b(lt|lte|gt|gte|in)\b/g,
    (match) => `$${match}`
  );

  // Parsing query string to JS object
  let queryToExecute = Bootcamp.find(JSON.parse(queryStr));

  // Selecting fields in response
  if (req.query.select) {
    // select=name,description
    const selectFields = req.query.select.split(',');
    const selectFieldsJoined = selectFields.join(' ');
    // Now it will be like query.select("name description")
    queryToExecute = queryToExecute.select(selectFieldsJoined);
  }

  // Sorting the response by field
  if (req.query.sort) {
    const fieldsToSort = req.query.sort.split(',');
    const fieldsToSortJoined = fieldsToSort.join(' ');
    queryToExecute = queryToExecute.sort(fieldsToSortJoined);
  } else {
    // By default sort it in descending order by createdAt
    queryToExecute = queryToExecute.sort('-createdAt');
  }

  // Pagination and limiting
  // Fetch page from query or by default first page
  const page = parseInt(req.query.page, 10) || 1;
  // Fetch limit from query or by defaul 100 results
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  queryToExecute = queryToExecute.skip(startIndex).limit(limit);

  // Executing the query
  const bootcamps = await queryToExecute;

  // Pagination details
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
});

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps/
// @access  Private
exports.createBootCamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootCamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootCamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get a bootcamp within a radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
exports.getBootCampsInRadius = async (req, res, next) => {
  try {
    const { zipcode, distance } = req.params;

    // Get Longitude, Latitude from Geocoder
    const loc = await geocoder.geocode(zipcode);
    const lng = loc[0].longitude;
    const lat = loc[0].latitude;

    // Calculate Radius using radians
    // Divide distance by radius of earth
    // Earth Radius = 3963 miles / 6378 km
    const radius = distance / 3963;
    const bootcamps = await Bootcamp.find({
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });
    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
    });
  } catch (err) {
    next(err);
  }
};
