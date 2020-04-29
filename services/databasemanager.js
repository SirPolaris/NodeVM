var mongoose = require("mongoose");
mongoose.Promise = global.Promise; // move to app
const ticketStates = require("../models/enums/ticketstates.js");
require("../models/endpoints/endpointsSchema");
require("../models/sr.js");

/**
 * Use this file to de-tightly-couple the mongo DB from the code
 */
var databaseManager = {
  properties: {
    test: {
      dbhost: process.env.DB_DEV_HOST,
      dbuser: process.env.DB_DEV_USER,
      dbpass: process.env.DB_DEV_PASS,
      dbport: process.env.DB_DEV_PORT,
      endpoint: process.env.DB_TEST_ENDPOINT,
    },
    dev: {
      dbhost: process.env.DB_DEV_HOST,
      dbuser: process.env.DB_DEV_USER,
      dbpass: process.env.DB_DEV_PASS,
      dbport: process.env.DB_DEV_PORT,
      host: process.env.DB_DEV_HOST,
    },
    production: {
      dbhost: process.env.DB_PROD_HOST,
      dbuser: process.env.DB_PROD_USER,
      dbpass: process.env.DB_PROD_PASS,
      dbport: process.env.DB_PROD_PORT,
      host: process.env.DB_PROD_HOST,
    },
    agenda: {
      dbhost: "127.0.0.1",
      dbport: "27017",
      endpoint: process.env.DB_AGENDA_ENDPOINT,
    },
    agendaTest: {
      dbhost: "127.0.0.1",
      dbport: "27017",
      endpoint: process.env.DB_AGENDA_TEST_ENDPOINT,
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
    agenda: function () {
      let Agenda = require("agenda");
      var mongoConnectionString =
        "mongodb://" +
        databaseManager.properties.agenda.dbhost +
        ":" +
        databaseManager.properties.agenda.dbport +
        databaseManager.properties.agenda.endpoint;
      return new Agenda({ db: { address: mongoConnectionString } });
    },
    agendaTest: function () {
      let Agenda = require("agenda");
      var mongoConnectionString =
        "mongodb://" +
        databaseManager.properties.agenda.dbhost +
        ":" +
        databaseManager.properties.agenda.dbport +
        databaseManager.properties.agenda.endpoint;
      return new Agenda({ db: { address: mongoConnectionString } });
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
  createRecord: function (serviceRequest) {
    mongoose.model("Sr").create(
      {
        pk_srid: serviceRequest.pk_srid,
        client_information: serviceRequest.client_information,
        timestamp: Date.now(),
        fk_srid: null,
        submissionChain: serviceRequest.submissionChain
          ? serviceRequest.submissionChain
          : null,
        attachments: serviceRequest.attachments
          ? serviceRequest.attachments
          : null,
        srType: serviceRequest.srType,
        severity: serviceRequest.severity ? serviceRequest.severity : "Medium",
        lat: serviceRequest.lat,
        lon: serviceRequest.lon,
        history: [
          {
            time: Date.now(),
            code: 0,
            text: "Created Record",
          },
        ],
        lastChecked: null,
        endPointUsed: undefined,
        servicePathUsed: undefined,
        srType: String,
        payload: [],
        status: serviceRequest.status
          ? serviceRequest.status
          : ticketStates.arrived,
        resent: serviceRequest.resent ? serviceRequest.resent : null,
      },
      function (err) {
        if (err) {
          console.log(
            "There was a problem creating the ticket on the database." +
              "\n" +
              err
          );
          return err;
        } else {
          console.log(
            "Created a ticket on the database successfully. ID:" +
              serviceRequest.pk_srid
          );
          return null;
        }
      }
    );
  },

  /*
    createUserRecord: function (userData) {
        mongoose.model('User').create({
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            created: (userData.created | Date.now()),
            token: userData.token,
            tokenExpire: userData.tokenExpire
        }, function (err) {
            if (err) {
                console.log("There was a problem creating a user on the database." + '\n'
                    + err)
                return err;
            } else {
                console.log("Created a user on the database successfully. ID:" + userData.email)
                return null;
            }
        });
    }*/

  createAccountRecord: function (accountData) {
    mongoose.model("Account").create(
      {
        created: Date.now(),
        email: accountData.email,
        betaToken: accountData.betaToken,
        fbToken: accountData.fbToken,
      },
      function (err) {
        if (err) {
          console.log(
            "There was a problem creating an account on the database." +
              "\n" +
              err
          );
          return err;
        } else {
          console.log(
            "Created an account on the database successfully, for email: " +
              accountData.email
          );
          return null;
        }
      }
    );
  },

  updateAccountRecord: function (accountData) {
    mongoose.model("Account").update(
      { email: accountData.email, betaToken: accountData.betaToken },
      {
        fbToken: accountData.fbToken,
      },
      function (err) {
        if (err) {
          console.log(
            "There was a problem update an account on the database." +
              "\n" +
              err
          );
          return err;
        } else {
          console.log(
            "Updated an account on the database successfully, for email: " +
              accountData.email
          );
          return null;
        }
      }
    );
  },

  findTicketRecord: async function (imp_pksrid) {
    var returnValue = await mongoose.model("Sr").find({ pk_srid: imp_pksrid });
    return returnValue[0];
  },

  createTestRecord: function (serviceRequest) {
    var randomState;

    function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; // The maximum is inclusive and the minimum is inclusive
    }

    let len = Object.keys(ticketStates).length;
    len = getRandomIntInclusive(0, len);
    randomState = Object.values(ticketStates)[len];

    mongoose.model("Sr").create(
      {
        pk_srid: serviceRequest.pk_srid,
        client_information: serviceRequest.client_information,
        timestamp: serviceRequest.timestamp || Date.now(),
        img_url: serviceRequest.img_url,
        fk_srid: null,
        srType: serviceRequest.srType,
        size: serviceRequest.size,
        status: randomState,
        lat: serviceRequest.lat,
        lon: serviceRequest.lon,
      },
      function (err) {
        if (err) {
          console.log(
            "There was a problem creating the ticket on the database." +
              "\n" +
              err
          );
          return err;
        } else {
          console.log(
            "Created a ticket on the database successfully. ID:" +
              serviceRequest.pk_srid
          );
          return null;
        }
      }
    );
  },

  findTickets: async function (
    imp_pksrid,
    auth,
    location,
    radius,
    appliedFilter
  ) {
    var returnValue;
    if (auth) {
      // Auth check
      /*
            if (authCheckIsValid()) {
                return null
            };
            */
      // Return detailed report for user.
      if (location) {
        returnValue = await mongoose
          .model("Sr")
          .find(
            { pk_srid: imp_pksrid, "client_information.uuid": auth },
            appliedFilter
          )
          .near({
            center: {
              type: "Point",
              coordinates: [location.lon, location.lat],
            },
            maxDistance: radius,
            spherical: true,
          });
      } else {
        returnValue = await mongoose
          .model("Sr")
          .find(
            { pk_srid: imp_pksrid, "client_information.uuid": auth },
            appliedFilter
          );
      }
    } else {
      // Hard restrict display at the db level using a filter
      // This is done so we don't display private data.
      // Later 'sub document' to protect from view/access
      appliedFilter =
        "client_information.displayName isActive servicePaths.geoApiV2.url";
      returnValue = await mongoose
        .model("Sr")
        .find({ pk_srid: imp_pksrid }, appliedFilter);
    }
    return returnValue;
  },

  /**
   * Find Endpoints at
   * This function returns the endpoint that are known to the provided location.
   * Right now returns only the city of ottawa. No logic yet.
   *
   * @param {Double} lat the latitude of a service request location in Decimal degrees
   * @param {Double} lon the longitude of a service request location in Decimal degrees
   * @param {Double} radius radius of selection
   * @param {Object} filter a object representing filter choices
   * @return {Object} a list of endpoints found at this location. Returns null if no location can be resolved.
   */
  findEndpointsAt: async function (lat, lon, radius, filter) {
    if (filter == "undefined" || filter == null) {
      filter = "";
    }

    // Override any incoming filtering because we haven't coded the query yet.
    filter = "";

    let returnValue = await mongoose
      .model("Endpoints")
      .find({}, filter)
      .where("coverage")
      .near({
        center: { type: "Point", coordinates: [lon, lat] },
        maxDistance: 100000,
        spherical: true,
      });

    return returnValue;
  },

  /**
   *  @private
   *  Return all ticket records.
   *  Not a public function as it displays private data
   */

  returnAllTicketRecords: async function () {
    var returnValue = await mongoose.model("Sr").find({});
    return returnValue;
  },

  /**
   * Return All Service Types
   * This function returns all known service types
   *
   * @return {Object} a list of endpoints known
   */
  returnAllServiceTypes: async function () {
    let returnValue = await mongoose.model("srTypeSchema").find({});
    return returnValue;
  },

  /**
   * Return All Service Types
   * This function returns all known service types
   *
   * @return {Object} a list of endpoints known
   */
  returnAllServiceTypesGroups: async function () {
    let returnValue = await mongoose
      .model("srTypeSchema")
      .distinct("properties.group", {})
      .exec();
    return returnValue;
  },

  /**
   * Return a Service Type
   * This function returns all known service types
   *
   * @return {Object} a list of endpoints known
   */
  returnAServiceTypes: async function (common_id) {
    let returnValue = await mongoose
      .model("srTypeSchema")
      .findOne({ "properties.common_service_code": common_id });
    return returnValue;
  },

  /**
   * Return Endpoints
   * This function returns all known endpoints
   *
   * @return {Object} a list of endpoints known
   */
  returnEndpoint: async function (id) {
    let returnValue = await mongoose
      .model("Endpoints")
      .findOne({ pk_epid: id });
    return returnValue;
  },

  /**
   * Return all Endpoints
   * This function returns all known endpoints
   *
   * @return {Object} a list of endpoints known
   */
  returnAllEndpoints: async function () {
    let returnValue = await mongoose.model("Endpoints").find({});
    return returnValue;
  },

  /**
   * Next to send
   * Returns the oldest timestamped ticket marked status arrived
   *
   * @param {endpoint} endpoint The Endpoint to query
   * @return (ticket) ticket_record The oldest ticket needed sending
   */

  nextToSend: async function (endpoint) {
    if (endpoint == "undefined" || endpoint == null) {
      return;
    }
    // Filter
    let filter = "";

    let returnValue = await mongoose
      .model("Sr")
      .find(
        {
          status: ticketStates.arrived,
        },
        filter
      )
      .sort({ timestamp: -1 })
      .limit(1);
    return returnValue;
  },

  /**
   * Store Endpoint
   */
  storeEndPoint: async function () {},

  /**
   * Load Endpoint
   */
  loadEndPoint: async function () {},

  /**
   * Load Exit Poll
   */
  loadExitPoll: async function () {},

  /**
   * Next to update
   * Returns a ticket marked with a "update" state with oldest lastChecked
   *
   *
   * @param {endpoint} endpoint The Endpoint to query
   * @return (ticket) ticket_record The oldest ticket needed updating
   */

  nextToUpdate: async function (endpoint) {
    if (endpoint == "undefined" || endpoint == null) {
      return;
    }
    // Filter
    let filter = "";

    let returnValue = await mongoose
      .model("Sr")
      .find(
        {
          $or: [
            { status: ticketStates.assigned },
            { status: ticketStates.inProgress },
            { status: ticketStates.waitingVerification },
          ],
        },
        filter
      )
      .sort({ lastChecked: -1 })
      .limit(1);
    return returnValue;
  },

  updateTicketRecord: function (srData) {
    mongoose
      .model("Sr")
      .findOneAndUpdate({ pk_srid: srData.pk_srid }, { $set: srData })
      .catch(
        console.log(
          "There was a problem updating the information to the database."
        )
      );
  },
};

module.exports = databaseManager;
