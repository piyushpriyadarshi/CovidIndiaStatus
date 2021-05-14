import express from "express";
import nodeCron from "node-cron";
import MailService from "@sendgrid/mail";
import getTodayCovidData from "./dataextractor.js";
import Axios from "axios";

const baseUrl =
  "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=844101&date=";

const headers = {};
headers["method"] = "get";
headers["user-agent"] =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36";

const app = express();

app.listen(3000);
const { schedule } = nodeCron;
schedule("10 10 * * *", function () {
  console.log("Running Cron Job for Covid Data");
  getTodayCovidData();
});

const htmlTemplate = `
<strong>Vaccine is Available </strong>
<h3>Please go to the Vaccine Center and get you and Your Family Vaccinated </h3>
`;
MailService.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: "priyadarship85@gmail.com", // Change to your recipient
  from: "piyush@piyushpriyadarshi.com", // Change to your verified sender
  subject: "Vaccine Notifier || Vaccine Available",
  // text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
};
MailService.send(msg)
  .then(() => {
    console.log("Email sent");
  })
  .catch((error) => {
    console.error(error);
  });

async function checkVaccineAvailability() {
  let datesArray = generateOneWeekDate();
  const finalResult = [];
  for (const date of datesArray) {
    await checkAvailabilityForDate(finalResult, date);
  }
  if (finalResult.length > 0) {
    console.log("vaccine is available");
  } else {
    console.log("vaccine is Not  available for 1 week");
  }
  console.log(finalResult);
}

async function checkAvailabilityForDate(result, date) {
  const apiEndPoint = baseUrl + date;
  console.log(apiEndPoint);
  let response;
  try {
    response = await Axios.get(apiEndPoint, { headers: headers });
    let centers = response.data.centers;
    centers.forEach((center) => {
      let centerSessions = center.sessions;
      centerSessions.forEach((session) => {
        if (session.available_capacity > 0 && session.min_age_limit === 45) {
          const data = {};
          data.address = center.address;
          data.name = center.name;
          data.pincode = center.pincode;
          data.date = session.date;
          result.push(data);
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
}

function addDaysToDate(date, days) {
  var res = new Date(date);
  res.setDate(res.getDate() + days);
  let month = res.getMonth() + 1;
  return res.getDate() + "-" + month + "-" + res.getFullYear();
}

function generateOneWeekDate() {
  let datesArr = [];
  const todayDate = new Date();
  for (let index = 0; index <= 7; index++) {
    const date = addDaysToDate(todayDate, index);
    datesArr.push(date);
  }
  return datesArr;
}

schedule("*/5 * * * *", function () {
  console.log("Running Cron Job for " + new Date().getTime());
  checkVaccineAvailability();
});
