import express from "express";
import compression from "compression"; // compresses requests
import session from "express-session";
import bodyParser from "body-parser";

import lusca from "lusca";
import dotenv from "dotenv";
import mongo from "connect-mongo";
import path from "path";
import mongoose from "mongoose";

import expressValidator from "express-validator";
import bluebird from "bluebird";
import { MONGODB_URI } from "./util/secrets";
import { default as Customers, CustomerModel } from "./models/Customers";
import fs from "fs";

const MongoStore = mongo(session);

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: ".env.example" });

// Controllers (route handlers)
import * as customerController from "./controllers/customers";

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
(<any>mongoose).Promise = bluebird;
mongoose
  .connect(process.env.MONGODB_URI || mongoUrl, { useMongoClient: true })
  .then(async () => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
    const customers = await Customers.find({})
      .lean()
      .exec();

    let jsonData: any[];
    fs.readFile(
      __dirname + "/../src/data/customers.json",
      "utf-8",
      async (err, data) => {
        if (err) throw err;
        if (data) {
          jsonData = JSON.parse(data);
          for (const customer of jsonData as CustomerModel[]) {
            const customerObj: any = await Customers.findOne({
              customerID: customer.customerID
            })
              .lean()
              .exec();

            if (!customerObj) {
              const newCustomer = new Customers({
                customerID: customer.customerID,
                gender: customer.gender,
                birthday: customer.birthday,
                name: {
                  first: customer.name.first,
                  last: customer.name.last
                },
                customerLifetimeValue: customer.customerLifetimeValue,
                lastContact: customer.lastContact
              });
              newCustomer.save((err: any) => {
                if (err) {
                  console.log("error");
                }
                console.log("users saved");
              });
            }
          }
        }
      }
    );
  })
  .catch(err => {
    console.log(
      "MongoDB connection error. Please make sure MongoDB is running. " + err
    );
    // process.exit();
  });

// Express configuration
app.set("port", process.env.PORT || 3500);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "15mb" }));
app.use(expressValidator());

app.use(
  session({
    secret: "secrettexthere",
    saveUninitialized: true,
    cookie: { secure: false },
    resave: false,
    // using store session on MongoDB using express-session + connect
    store: new MongoStore({
      url: mongoUrl,
      collection: "sessions"
    })
  })
);

app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

// Add headers
app.use(function(req, res, next) {
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header("Access-Control-Allow-Origin", "*");
  // Request headers you wish to allow
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Pass to next layer of middleware
  next();
});
app.use(express.static(path.join(__dirname, "public")));

/**
 * API examples routes.
 */

app.post("/api/v1/customers", customerController.createCustomer);

app.put("/api/v1/customers", customerController.updateCustomer);

app.get("/api/v1/customers", customerController.getCustomers);

app.delete("/api/v1/customers/:id", customerController.deleteCustomers);

app.get("/api/v1/customers/:id", customerController.checkCustomerIdNotTaken);

// Serve only the static files form the dist directory
app.use(express.static(__dirname + "/../build/customer-managment"));

app.get("/*", function(req, res) {
  res.sendFile(
    path.join(__dirname + "/../build/customer-managment/index.html")
  );
});
export default app;
