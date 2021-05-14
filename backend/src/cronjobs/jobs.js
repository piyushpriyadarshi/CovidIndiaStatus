import express from "express";
import nodeCron from "node-cron";
const { schedule } = nodeCron;
import checkVaccineAvailability from "../vaccine/vaccine.js";
const jobs = express.Router();

jobs.vaccineJobs = schedule("*/4 * * * *", function () {
  console.log("Running Cron Job for " + new Date().toTimeString());
  checkVaccineAvailability();
});

export default jobs.vaccineJobs;
