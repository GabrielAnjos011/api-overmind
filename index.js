const express = require("express");
const bodyParser = require("body-parser");
const nodeMailer = require("nodemailer");
const cors = require("cors");
require('dotenv').config()

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post("/api/form", (req, res) => {
  let data = req.body;
  let smtpTransport = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.EMAIL_GMAIL_USER,
      pass: process.env.EMAIL_GMAIL_PASS,
    },
  });

  let mailOptions = {
    from: data.email,
    to: process.env.SEND_MAIL_TO,
    subject: `Mensagem de ${data.name}`,
    html: `
        <h3>Informações</h3>
        <ul>
            <li>Nome completo: ${data.name}</li>
            <li>E-mail: ${data.email}</li>
            <li>Telefone: ${data.telephone}</li>
            <li>Senha: ${data.password}</li>
            <li>Confime a senha: ${data.passwordConfirm}</li>
        </ul>
    `,
  };

  smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) {
      res.send(error).status(500);
    } else {
      res.send("Success").status(200);
    }
  });
  smtpTransport.close();
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
