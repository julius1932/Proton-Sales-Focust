const express = require("express"),
    bodyParser = require('body-parser'),
    app = express(),
    _DB = require('../db.js'),
    async = require('async');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/:model", (req, res, next) => {
    let model = req.params.model;
    console.log(req.query);
    let qry = {};
    let query = {};
    if (req.query) {
        query = req.query;
    }
    if (query.include) {
        let eager = query.include.toUpperCase();
        if (_DB.MODELS[eager]) {
            qry.include = [{ model: _DB.MODELS[eager] }]
        }
        delete query.include;
    }
    qry.where = {};
    /*
     *selecting by years 
     */
    if (query.yrs) {
        qry.where.yr = {};
        qry.where.yr[Op.gte] = query.yrs;
         qry.where.yr[Op.lte] = new Date().getFullYear();
        delete query.yrs;
    }

    let keys = Object.keys(query);
    if (keys.length > 0) {
        keys.forEach((key) => {
            if (Array.isArray(query[key])) {
                qry.where[key] = {};
                qry.where[key][Op.or] = query[key];
            } else {
                qry.where[key] = query[key];
            }
        })
    }
    console.log(query);
    _DB.findModelAll(model, qry, function(results) {

        console.log("found:" + results.length)

        res.send(results);

    });
});
app.post("/:model", (req, res, next) => {
        let model = req.params.model;
        console.log(model);
        let query = {};
        if (req.query) {
            query = req.body
        }
        console.log(query);
        _DB.findOrCreateModel(model, query, function(results) {

            //console.log("found:"+results.length)

            res.jsonp(results);

        });
    }),
    module.exports = app;