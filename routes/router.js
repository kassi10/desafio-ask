const express = require('express');
const router = express.Router();
const SearchController = require('../controllers/SearchController');

router.get('/', (req, res) => {
    res.send('Hello Asksuite World!');
});

router.post('/search', SearchController.search);

module.exports = router;
