import Axios from "axios";
import sendMail from "../mail/mail.js";
const baseUrl =
  "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=844503&date=";

const headers = {};
headers["method"] = "get";
headers["user-agent"] =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36";

async function checkVaccineAvailability() {
  let datesArray = generateOneWeekDate();
  const finalResult = [];
  for (const date of datesArray) {
    await checkAvailabilityForDate(finalResult, date);
  }
  if (finalResult.length > 0) {
    console.log("vaccine is available");
    sendMail(["priyadarship4@gmail.com"], finalResult);
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
        if (session.available_capacity > 0 && session.min_age_limit === 18) {
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
  for (let index = 0; index <= 3; index++) {
    const date = addDaysToDate(todayDate, index);
    datesArr.push(date);
  }
  return datesArr;
}

export default checkVaccineAvailability;
