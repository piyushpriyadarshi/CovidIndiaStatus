import MailService from "@sendgrid/mail";

const data = [
  {
    address: "Main Road Near Bidupur Block Bidupur",
    name: "Bidupur PHC",
    date: "12-05-2021",
  },
];

function generateMailBodyForVaccine(finalResult) {
  let htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        table,
        th,
        td {
            border: 1px solid black;
            border-collapse: collapse;
        }
        th, td {
  padding: 15px;
}
    </style>
</head>
<body>
<strong>Vaccine is Available </strong>
<h3>Please go to the Vaccine Center and get you and Your Family Vaccinated </h3>
<center>
<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Date</th>
        </tr>
    </thead>
    <tbody>`;
  data.forEach((element) => {
    console.log(element);
    const trOpening = "<tr>";
    const tdName = `<td>${element.name}</td>`;
    const tdAddr = `<td>${element.address}</td>`;
    const tdDate = `<td>${element.date}</td>`;
    const trClosing = "</tr>";
    htmlTemplate += trOpening;
    htmlTemplate += tdName;
    htmlTemplate += tdAddr;
    htmlTemplate += tdDate;
    htmlTemplate += trClosing;
  });
  const tbodyClosing = `</tbody></table></center></body></html>`;
  htmlTemplate += tbodyClosing;
  return htmlTemplate;
}

const htmlTemplate = generateMailBodyForVaccine(data);
MailService.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: "priyadarship85@gmail.com", // Change to your recipient
  from: "priyadarship4@gmail.com", // Change to your verified sender
  subject: "Vaccine Notifier || Vaccine Available",
  // text: "and easy to do anywhere, even with Node.js",
  html: htmlTemplate,
};
MailService.send(msg)
  .then(() => {
    console.log("Email sent");
  })
  .catch((error) => {
    console.error(error.toString());
  });
