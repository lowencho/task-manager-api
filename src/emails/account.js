const sgMail = require("@sendgrid/mail"); // to use methods for sending email

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "Newuser04477@gmail.com",
    subject: "Thanks for joining in!",
    text: `Welcome to the App, ${name}. Let me know how you get along with the app.`
  });
};

const cancelAccountEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "Newuser04477@gmail.com",
    subject: "Sorry to see you go!",
    text: `Goodbye, ${name}, I hope to see you back soon.`
  });
};

module.exports = {
  sendWelcomeEmail,
  cancelAccountEmail
};
