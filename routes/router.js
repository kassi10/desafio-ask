const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello Asksuite World!');
});

router.post('/search', (req, res) => {
    res.send('Hello Asksuite World kassi!');
});

module.exports = router;
