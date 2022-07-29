import os from "os";
import path from "path";
import { INTEGER, NUMBER, Sequelize, STRING, ENUM } from "sequelize";

import { User, Time, Appointment } from "./models";

const sequelize = new Sequelize("calendar-example", "", undefined, {
  dialect: "sqlite",
  storage: path.join(os.tmpdir(), "db.sqlite"),
  logging: true,
});

// Initialize all models.
User.init(
  {
    nonce: {
      allowNull: false,
      type: INTEGER.UNSIGNED, // SQLITE will use INTEGER
      defaultValue: (): number => Math.floor(Math.random() * 10000), // Initialize with a random nonce
    },
    publicAddress: {
      // polygon public address of the user
      allowNull: false,
      type: STRING,
      unique: true,
      validate: { isLowercase: true },
    },
    username: {
      type: STRING, // user defined username
      unique: true,
    },
  },
  {
    modelName: "user",
    sequelize, // This bit is important
    timestamps: true,
  }
);

Time.init(
  {
    user: {
      allowNull: false,
      type: INTEGER.UNSIGNED, // SQLITE will use INTEGER
    },
    status: {
      allowNull: false,
      type: STRING,
      defaultValue: "unavailable", // Initialize with a unavailable status
    },
    timestart: {
      type: NUMBER, // start time the user is available in epoch
    },
    timeend: {
      type: NUMBER, // end time the user is available in epoch
    },
  },
  {
    modelName: "time",
    sequelize, // This bit is important
    timestamps: true,
  }
);

Appointment.init(
  {
    fromUser: {
      allowNull: false,
      type: NUMBER, // SQLITE will use INTEGER
    },
    toUser: {
      allowNull: true,
      type: NUMBER,
    },
    timestart: {
      type: NUMBER,
    },
    timeend: {
      type: NUMBER,
    },
    status: {
      type: ENUM,
      values: ["available", "unavailable"],
    },
  },
  {
    modelName: "appointment",
    sequelize, // This bit is important
    timestamps: true,
  }
);

// Create new tables
sequelize.sync();

User.hasMany(Appointment, { foreignKey: "fromUser" });
User.hasMany(Appointment, { foreignKey: "toUser" });
User.hasMany(Time, { foreignKey: "user" });

export { sequelize };
