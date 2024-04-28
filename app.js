const express = require("express");
const mongoose = require("mongoose");
const {
  authRoute,
  cityRoute,
  locationRoute,
  bookingRoute,
  driverRoute,
  contactusRoute,
  rideRoute,
} = require("./routes");
require("dotenv").config();
const cors = require("cors");

// const { google } = require("googleapis");
// const scheduler = require("./utils/scheduler");
// const { emailScheduler } = require("./controllers/Schedulers");
// const { OAuth2Client } = require("google-auth-library");

const app = express();

const uri = `mongodb+srv://heyrides06:LSuEV7Ywm9308xn1@cluster0.ac7fdu0.mongodb.net/HeyRides?retryWrites=true&w=majority`;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// //Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// cors
// const domainsFromEnv = process.env.CORS_DOMAINS || ""
// const whitelist = domainsFromEnv.split(",").map(item => item.trim())
const whitelist = [
  "http://localhost:3000",
  "https://heyrides.netlify.app",
  "https://www.heyrides.ca",
  "https://heyrides.ca",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use("/", authRoute);
app.use("/city", cityRoute);
app.use("/location", locationRoute);
app.use("/ride", rideRoute);
app.use("/booking", bookingRoute);
app.use("/driver", driverRoute);
app.use("/contactus", contactusRoute);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

// email scheduler
// const oAuth2client = new google.auth.OAuth2(
//   process.env.oAuth_client_id,
//   process.env.client_secret_id,
//   process.env.redirect_uri
// );
// oAuth2client.setCredentials({ refresh_token: process.env.refresh_token });
// scheduler("* * */4 * *", async () => {
//   const access_token = await oAuth2client.getAccessToken();
//   emailScheduler(access_token);
// });
////////////////////////////////

app.listen(process.env.PORT || 3001, () => {
  console.log("Connected");
});
