import fs from "fs/promises";
import path from "path";
const __dirname = path.resolve();
import MailService from "@sendgrid/mail";

const sendMail = (toArr, result) => {
  generateMailBodyForVaccine(result)
    .then((data) => {
      console.log(process.env.SENDGRID_API_KEY);
      MailService.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: toArr, // Change to your recipient
        from: "priyadarship85@gmail.com", // Change to your verified sender
        subject: "Vaccine Notifier || Vaccine Available " + result[0].date,
        html: data,
      };
      MailService.send(msg)
        .then(() => {
          console.log("Email sent");
        })
        .catch((error) => {
          console.error(error.toString());
        });
    })
    .catch((onerror) => {
      console.log("Some Error Ocuured while generating Mail Body");
    });
};

async function generateMailBodyForVaccine(result) {
  return new Promise(async (resolve, reject) => {
    let htmlTemplate;
    try {
      console.log(__dirname);
      htmlTemplate = await fs.readFile(
        __dirname + "/src/mail/mailTemplate.html"
      );
      console.log(htmlTemplate.toString());
    } catch (error) {
      console.log(error);
      reject(error);
    }
    result.forEach((element) => {
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
    resolve(htmlTemplate);
  });
}

export default sendMail;
