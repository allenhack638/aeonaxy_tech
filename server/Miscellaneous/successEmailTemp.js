const sendMail = (name, email) => {
  const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Verification Success</title>
      </head>
      <body>
        <div class="container">
          <h1>Hello ${name},</h1>
          <p>Your account has been successfully verified!</p>
          <p>You can now enjoy full access to our platform.</p>
          <p>If you have any questions or need assistance, feel free to revert back us.</p>
          <br>
          <p>Best regards,</p>
          <p>Sample Team</p>
        </div>
      </body>
      </html>
    `;

  const formattedHtml = htmlTemplate.replace("${name}", name);

  const successTemp = {
    from: '"Sample Team"',
    to: email,
    subject: "Account Verification Success",
    html: formattedHtml,
  };
  return successTemp;
};
module.exports = sendMail;
