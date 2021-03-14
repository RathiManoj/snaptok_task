var router = require("express").Router(),
    passport = require("passport"),
    jsonWebToken = require("jsonwebtoken");

var User = require("../models/user");

router.get("/", (req, res) => {
    res.send("Hello there...");
})

router.post("/login", (req, res) => {
    passport.authenticate("local")(req, res, (err, user) => {
        User.findOne({ email: req.body.email }, (err, user) => {
            if (err) {
                return res.send({ success: false, message: err.message });
            }
            req.login(user, { session: false }, err => {
                if (err) {
                    return res.json({ success: false, message: err.message });
                }
                var payload = { sub: user._id, email: user.email, name: user.name };
                var jwtToken = jsonWebToken.sign(payload, "secret_token_key");
                return res.json({ jwtToken });
            })

        })
    })
});


router.post("/register", (req, res) => {
    var user = {
        name: req.body.name,
        email: req.body.email,
        phoneno: req.body.phoneno
    }
    User.register(user, req.body.password, (err, user) => {
        if (err) {
            res.json({ success: false, message: err.message });
        }
        else {
            res.json({ success: true, user: user });
        }
    })
})

module.exports = router;