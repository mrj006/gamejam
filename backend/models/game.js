const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve("backend", ".env") });

//_id is the email, mongoose requirement https://mongoosejs.com/docs/guide.html#_id
const gameSchema = new mongoose.Schema({
  _id: {
    type: String,
    match: [new RegExp(process.env.TITLE_REGEX), process.env.TITLE_ERROR],
  },
  description: {
    type: String,
    required: function () {
        return this._id !== null;
      },
  },

  pitchLink: {
    type: String,
    required: function () {
        return this._id !== null;
      }
  },
  isForUnderage: {
    type: Boolean,
    required: function () {
        return this._id !== null;
      }
  },
  companyLink: {
    type: String,
    required: function () {
        return this._id !== null;
      }
  },
  companyName: {
    type: String,
    required: function () {
        return this._id !== null;
      }
  },
  teamName: {
    type: String,
    required: true,
    match: [new RegExp(process.env.NAME_REGEX), process.env.NAME_ERROR],
  },
  aboutTeam: {
    type: String,
    required: function () {
        return this._id !== null;
      }
  },
  teamResponsable: {
    type: String,
    match: [new RegExp(process.env.EMAIL_REGEX), process.env.EMAIL_ERROR],
    required: true,
  },
  teamMembers: {
    type: Array,
    default: [],
  },
  themes: {
    type: Array,
    default: [],
  },
  genre: {
    type: Array,
    default: [],
  },
  categories: {
    type: Array,
    default: [],
  },
  engine: {
    type: Array,
    default: [],
  },
  platforms: {
    type: Array,
    default: [],
  }
});

module.exports = mongoose.model("Game", gameSchema);
