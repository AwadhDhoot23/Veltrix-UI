const express = require('express');
const router = express.Router();
const { getFavorites, addFavorite, removeFavorite } = require('../controller/favorite.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/')
  .get(getFavorites);

router.route('/:componentId')
  .post(addFavorite)
  .delete(removeFavorite);

module.exports = router;
