var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    passport = require("passport"),
    JwtStrategy = require("passport-jwt").Strategy,
    ExtractJwt = require("passport-jwt").ExtractJwt;

var User = require("./models/user");

const DB = "snaptok-task",
    DB_USER = process.env.MongoDB_USER,
    DB_PASS = process.env.MongoDB_PASS,
    DB_HOST = process.env.MongoDB_HOST,
    DB_URL = "mongodb+srv://" + DB_USER + ":" + DB_PASS + "@" + DB_HOST + "/" + DB + "?retryWrites=true&w=majority";

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport Config
app.use(passport.initialize());
passport.use(User.createStrategy());
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "secret_token_key"
}, (payload, done) => {
    User.findOne({ _id: payload.sub }, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    })
}))

// ROUTES
app.use("/", require("./routes/index"));
//protected route
app.get("/profile", passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send("Accessed to protected Profile Page.");
});

app.listen(process.env.PORT || 8080, (req, res) => {
    console.log("Server started...")
});