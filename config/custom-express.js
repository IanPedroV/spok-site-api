let express = require('express');
let consign = require('consign');
let cors = require('cors');

module.exports = function () {
    let app = express();
    app.use(cors());

    consign()
        .into(app);
    return app;
};