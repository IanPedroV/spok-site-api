let express = require('express');
let consign = require('consign');
let bodyParser = require('body-parser');
let cors = require('cors');
let helmet = require('helmet');

module.exports = function () {
    let app = express();
    app.use(helmet());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cors());

    consign()
        .include('controllers')
        .into(app);
    return app;
};