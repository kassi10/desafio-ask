require('dotenv').config();
const express = require('express');
const router = require('./routes/router.js');

const app = express();
app.use(express.json());

app.use('/', router);
app.use('/search', router);

const port = process.env.PORT || 8080;
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
}

module.exports = app;
