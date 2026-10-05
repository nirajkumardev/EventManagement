const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});


const sendOtpEmail = async (userEmail, otp, type) => {

  try {

    const title =
      type === 'account_verification'
        ? 'Verify Your Eventor Account'
        : 'Event Booking Verification';


    const message =
      type === 'account_verification'
        ? 'Use the OTP below to verify your Eventor account.'
        : 'Use the OTP below to confirm your event booking.';


    const mailOptions = {

      from: process.env.EMAIL_USER,

      to: userEmail,

      subject: title,

      text: `${message} Your OTP code is ${otp}.`,

      html: `
        <!DOCTYPE html>

        <html>

        <head>

          <meta charset="UTF-8">

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          >

          <title>${title}</title>

        </head>


        <body style="
          margin:0;
          padding:0;
          background:#f4f6f8;
          font-family:Arial, Helvetica, sans-serif;
        ">

          <div style="
            width:100%;
            padding:30px 0;
          ">

            <div style="
              max-width:500px;
              margin:auto;
              background:#ffffff;
              border-radius:12px;
              padding:30px 20px;
              box-sizing:border-box;
              text-align:center;
            ">

              <h1 style="
                margin:0 0 10px;
                color:#2563eb;
                font-size:28px;
              ">
                Eventor
              </h1>


              <h2 style="
                margin:0 0 15px;
                color:#222222;
                font-size:22px;
              ">
                🔐 ${title}
              </h2>


              <p style="
                margin:0 0 20px;
                color:#555555;
                font-size:15px;
                line-height:1.6;
              ">
                Hello,

                <br><br>

                ${message}
              </p>


              <div style="
                background:#f1f5ff;
                border:1px solid #dbe4ff;
                border-radius:10px;
                padding:20px 10px;
                margin:20px 0;
              ">

                <p style="
                  margin:0 0 8px;
                  color:#666666;
                  font-size:13px;
                ">
                  Your OTP Code
                </p>


                <div style="
                  font-size:32px;
                  font-weight:bold;
                  letter-spacing:8px;
                  color:#2563eb;
                ">
                  ${otp}
                </div>

              </div>


              <p style="
                margin:15px 0;
                color:#777777;
                font-size:13px;
              ">
                ⚠️ Please do not share this OTP with anyone.
              </p>


              <p style="
                margin:20px 0 0;
                color:#999999;
                font-size:12px;
              ">
                If you did not request this OTP,
                you can safely ignore this email.
              </p>


              <hr style="
                border:none;
                border-top:1px solid #eeeeee;
                margin:25px 0 15px;
              ">


              <p style="
                margin:0;
                color:#aaaaaa;
                font-size:11px;
              ">
                This is an automated email from Eventor.
                <br>
                Please do not reply.
              </p>

            </div>

          </div>

        </body>

        </html>
      `
    };


    await transporter.sendMail(mailOptions);

    console.log(
      `OTP sent to ${userEmail} for ${type}`
    );

    return true;

  } catch (error) {

    console.log(
      `Error sending OTP to ${userEmail}`,
      error
    );

    return false;
  }
};


const sendBookingEmail = async (
  userEmail,
  userName,
  eventName,
  eventDate,
  eventTime,
  eventLocation,
  bookingId
) => {

  try {

    const mailOptions = {

      from: process.env.EMAIL_USER,

      to: userEmail,

      subject: 'Event Booking Confirmed - Eventor',

      text: `
Hello ${userName},

Your event booking has been confirmed successfully.

Event: ${eventName}
Date: ${eventDate}
Time: ${eventTime}
Location: ${eventLocation}
Booking ID: ${bookingId}

Thank you for choosing Eventor.
      `,

      html: `
        <!DOCTYPE html>

        <html>

        <head>

          <meta charset="UTF-8">

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          >

          <title>Booking Confirmed</title>

        </head>


        <body style="
          margin:0;
          padding:0;
          background:#f4f6f8;
          font-family:Arial, Helvetica, sans-serif;
        ">

          <div style="
            width:100%;
            padding:30px 0;
          ">

            <div style="
              max-width:500px;
              margin:auto;
              background:#ffffff;
              border-radius:12px;
              padding:30px 20px;
              box-sizing:border-box;
            ">


              <div style="
                text-align:center;
              ">

                <h1 style="
                  margin:0 0 10px;
                  color:#2563eb;
                  font-size:28px;
                ">
                  Eventor
                </h1>


                <div style="
                  font-size:45px;
                  margin:10px 0;
                ">
                  ✅
                </div>


                <h2 style="
                  margin:0 0 10px;
                  color:#222222;
                  font-size:24px;
                ">
                  Booking Confirmed!
                </h2>


                <p style="
                  margin:0 0 25px;
                  color:#666666;
                  font-size:15px;
                  line-height:1.6;
                ">
                  Hello ${userName},

                  <br>

                  Your event booking has been confirmed successfully.
                </p>

              </div>


              <div style="
                background:#f8faff;
                border:1px solid #dbe4ff;
                border-radius:10px;
                padding:20px;
              ">

                <h3 style="
                  margin:0 0 15px;
                  color:#222222;
                  font-size:18px;
                ">
                  Booking Details
                </h3>


                <p style="
                  margin:10px 0;
                  color:#555555;
                  font-size:14px;
                ">
                  <strong>Event:</strong>
                  ${eventName}
                </p>


                <p style="
                  margin:10px 0;
                  color:#555555;
                  font-size:14px;
                ">
                  <strong>Date:</strong>
                  ${eventDate}
                </p>


                <p style="
                  margin:10px 0;
                  color:#555555;
                  font-size:14px;
                ">
                  <strong>Time:</strong>
                  ${eventTime}
                </p>


                <p style="
                  margin:10px 0;
                  color:#555555;
                  font-size:14px;
                ">
                  <strong>Location:</strong>
                  ${eventLocation}
                </p>


                <p style="
                  margin:10px 0;
                  color:#555555;
                  font-size:14px;
                  word-break:break-all;
                ">
                  <strong>Booking ID:</strong>
                  ${bookingId}
                </p>

              </div>


              <div style="
                margin-top:20px;
                padding:15px;
                background:#ecfdf5;
                border-radius:8px;
                text-align:center;
              ">

                <p style="
                  margin:0;
                  color:#047857;
                  font-size:14px;
                ">
                  🎉 Your booking is confirmed.
                </p>

              </div>


              <hr style="
                border:none;
                border-top:1px solid #eeeeee;
                margin:25px 0 15px;
              ">


              <p style="
                margin:0;
                text-align:center;
                color:#999999;
                font-size:11px;
                line-height:1.5;
              ">
                Thank you for choosing Eventor.

                <br>

                This is an automated email.
                Please do not reply.
              </p>


            </div>

          </div>

        </body>

        </html>
      `
    };


    await transporter.sendMail(mailOptions);

    console.log(
      `Booking confirmation email sent to ${userEmail}`
    );

    return true;

  } catch (error) {

    console.log(
      `Error sending booking email to ${userEmail}`,
      error
    );

    return false;
  }
};

module.exports = {
  sendOtpEmail,
  sendBookingEmail
};
