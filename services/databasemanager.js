var mongoose = require("mongoose");
const user = require("../models/user");

mongoose.Promise = global.Promise; // move to app

/**
 * Use this file to de-tightly-couple the mongo DB from the code. THis connect also can be used in test.
 */
var databaseManager = {
  properties: {
    test: {
      dbhost: process.env.DB_DEV_HOST,
      dbport: process.env.DB_DEV_PORT,
      endpoint: process.env.DB_DEV_ENDPOINT,
    },
    dev: {
      dbhost: process.env.DB_DEV_HOST,
      dbport: process.env.DB_DEV_PORT,
      endpoint: process.env.DB_DEV_ENDPOINT,
    },
    production: {
      dbhost: process.env.DB_PROD_HOST,
      dbuser: process.env.DB_PROD_USER,
      dbpass: process.env.DB_PROD_PASS,
      dbport: process.env.DB_PROD_PORT,
      endpoint: process.env.DB_PROD_ENDPOINT,
    },
  },
  connectTo: {
    test: function () {
      mongoose.connect(
        "mongodb://" +
          databaseManager.properties.test.dbhost +
          ":" +
          databaseManager.properties.test.dbport +
          databaseManager.properties.test.endpoint
      );
    },
    dev: function () {
      mongoose.connect(
        "mongodb://" +
          databaseManager.properties.dev.host +
          databaseManager.properties.dev.endpoint
      );
    },
    production: function () {
      mongoose.connect(
        "mongodb://" +
          this.properties.production.dbuser +
          ":" +
          this.properties.production.dbpass +
          "@" +
          this.properties.production.dbhost +
          "/URT-DB",
        {
          auth: { authdb: "admin" },
        }
      );
    },
  },

  closeConnection: function () {
    mongoose.connection.close();
  },

  /**
   * Create record builds a service request into a internal service request (ticket)
   * SR Fields not filled in now are handled later by sub processes
   *
   * @param {*} serviceRequest
   */
  createRecord: function (VMRequest) {
    mongoose.model("VM").create(
      {
        pk_srid: VMRequest.pk_srid,
        client_information: VMRequest.client_information,
        timestamp: Date.now(),
        fk_srid: null,
      },
      function (err) {
        if (err) {
          console.log(
            "There was a problem creating the VM on the database." +
              "\n" +
              err
          );
          return err;
        } else {
          console.log(
            "Created a VM on the database successfully. ID:" +
            VMRequest.pk_srid
          );
          return null;
        }
      }
    );
  },
};

module.exports = databaseManager;
