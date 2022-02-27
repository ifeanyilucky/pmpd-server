require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const helmet = require("helmet");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin: "https://thebrick.com.ng",
  })
);

app.post("/contact", (req, res) => {
  console.log(req.body);
  const { name, email, message } = req.body;
  const msg = `
  <html lang="en">



  <body style="font-size: 16px; color: #000000;">
      <div>
          <div style="padding: 50px 25px">
              <h3>
                  So we actually have a new message from ${name}
              </h3>
            
                 <h4>Message:</h4> 
                 <p>${message}</p>
              
             
              <p></p>
              <p>
                  click the link below to reply
                  <a href="mailto:${email}">Reply now</a>
              </p>
              <br />
              <p></p>
              <br />
              Love ❤,
              <p></p>
              <a href="https://thepmpd.com.ng/" target="_blank">
                  https://thepmpd.com.ng
              </a>
          </div>
      </div>
  </body>
  
  </html>
  `;
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
  });
  let mailOptions = {
    from: email,
    to: process.env.MAIL_USERNAME,
    subject: `New message from ${name}`,
    html: msg,
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log(err);
      res.status(400).json(err);
    } else {
      console.log("Email sent successfully");
    }
  });
  res.status(200).json({ msg: `Hi ${name} 🤗, we have received your message` });
});

const PORT = process.env.PORT || 3200;

const start = () => {
  app.listen(PORT, () => {
    console.log("server started");
  });
};

start();
