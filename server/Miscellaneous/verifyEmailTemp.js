const verifyEmail = (name, email, verificationLink) => {
  const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Verification Success</title>
        </head>
        <body>
            <h1>Hello ${name},</h1>
            <p>Click the following link to verify your account:</p>
            <a href="${verificationLink}">${verificationLink}</a>
            <p>If you did not request this, please ignore this email.</p>
            <br>
            <p>Best regards,</p>
            <p>Your Company Name</p>
        </body>
        </html>
      `;

  const formattedHtml = htmlTemplate
    .replace("${name}", name)
    .replace("${verificationLink}", verificationLink);

  const verifyMail = {
    from: '"Verify Email"',
    to: email,
    subject: "Verify Your Account",
    html: formattedHtml,
  };

  return verifyMail;
};

module.exports = verifyEmail;

// Now you can use emailHtmlContent to send the email to the user
