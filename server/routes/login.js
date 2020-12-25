const express = require("express")
const app = express.Router()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const User = require("./../models/login")

process.env.SECRET_KEY = 'secret'

app.post('/login', (req, res) => {

    if (req.body.username == "" || req.body.password == "") {
    res.send([1,"Please fill the field"])
    } else {
        User.findOne({ username: req.body.username }, (err, user) => {
            if (!user) {
                res.send([1, 'User does not exist'])
            } else {
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    const payload = {
                        username: user.username,
                        date: Date.now()
                    }
                    let token = jwt.sign(payload, process.env.SECRET_KEY, {
                        expiresIn: "48h"
                    })
                    res.send([0,token])
                } else {
                    res.send([1,'Wrong password'])
                }
            }
        });
    }

});

module.exports = app