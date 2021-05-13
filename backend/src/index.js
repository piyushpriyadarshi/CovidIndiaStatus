import express from "express";
import jobs from "./cronjobs/jobs.js";

const app = express();

app.listen(3000, () => {
  console.log("Listening");
});
