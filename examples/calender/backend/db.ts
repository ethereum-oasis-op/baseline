import os from "os";
import path from "path";
import { INTEGER, NUMBER, Sequelize, STRING } from "sequelize";

import { User, Time, Appointment } from "./models";

const sequelize = new Sequelize("baseline-calender", "", undefined, {
  dialect: "sqlite",
  storage: path.join(os.tmpdir(), "db.sqlite"),
  logging: false,
});

// Init all models
User.init(
  {
    nonce: {
      allowNull: false,
      type: INTEGER.UNSIGNED, // SQLITE will use INTEGER
      defaultValue: (): number => Math.floor(Math.random() * 10000), // Initialize with a random nonce
    },
    publicAddress: {
      allowNull: false,
      type: STRING,
      unique: true,
      validate: { isLowercase: true },
    },
    username: {
      type: STRING,
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
    userId: {
      allowNull: false,
      type: INTEGER.UNSIGNED, // SQLITE will use INTEGER
    },
    status: {
      allowNull: false,
      type: STRING,
      defaultValue: "unavailable", // Initialize with a unavailable status
    },
    timestart: {
      type: NUMBER,
    },
    timeend: {
      type: NUMBER,
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
    fromUserId: {
      allowNull: false,
      type: NUMBER, // SQLITE will use INTEGER
    },
    toUserId: {
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
      type: STRING,
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

export { sequelize };
