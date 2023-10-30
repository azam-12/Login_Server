const { createMailTransporter } = require("./createMailTransporter")

const sendOTPMail = (user) => {
    const transporter = createMailTransporter()

    const mailOptions = {
        from: '"Gmail ID" <support@gmail.com>',
        to: user.email,
        subject: "Login OTP",
        html: `<p>Hello! ${user.email}, please enter below otp to continue login. </p>
        <p>${user.otp}</p>`
    }


    transporter.sendMail(mailOptions, (error, info) => {
        if(error)
            console.log(error)
        else   
            console.log("OTP email sent.")
    })

}


module.exports = { sendOTPMail }