export const EmailotpTmeplate = function (otp : string , title : string, descreption:string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
        }
        .container {
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            max-width: 350px;
            margin: auto;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-top: 5px solid #5A189A;
        }
.otp {
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 5px;
    margin: 15px auto; 
    background: #5A189A;
    color: #fff;
    padding: 12px;
    display: block;
    border-radius: 6px;
    width: fit-content; 
}

        .message {
            font-size: 16px;
            color: #333;
            margin-bottom: 12px;
        }
        .footer {
            font-size: 13px;
            color: #555;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2 style="color: #5A189A;">${title}</h2>
        <p class="message">Hello,</p>
        <p class="message">${descreption}</p>
        <div class="otp">${otp}</div>
        <p class="message">This code is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
        <p class="footer">If you did not request this, please ignore this email.</p>
    </div>
</body>
</html>`;
};

export const EmailUrlAuth = function (link:string) {
  return `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
        }

        .container {
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            max-width: 350px;
            margin: auto;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-top: 5px solid #5A189A;
        }

        .btn {
            display: block;
            text-align: center;
            color: #fff !important;
            text-decoration: none !important;
            background: #5A189A;
            font-size: 18px;
            font-weight: bold;
            padding: 12px 20px;
            border-radius: 6px;
            margin: 15px auto;
            width: fit-content;
        }

        .message {
            font-size: 16px;
            color: #333;
            margin-bottom: 12px;
        }

        .footer {
            font-size: 13px;
            color: #555;
            margin-top: 20px;
        }
    </style>
</head>

<body>
    <div class="container">
        <h2 style="color: #5A189A;">Verify Your Email</h2>
        <p class="message">Hello,</p>
        <p class="message">To activate your account, please click the button below:</p>
        <a href="${link}" target="_blank" class="btn">Activate Account</a>
        <p class="message">If the button doesn't work, copy and paste the following link into your browser:</p>
        <p class="message" style="word-break: break-word; color: #5A189A;">${link}</p>
        <p class="footer">If you did not request this, please ignore this email.</p>
    </div>
</body>

</html>
`;
};