const nodemailer = require("nodemailer")

const createMailTransporter = () => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "azammynike@gmail.com",
            pass: process.env.EMAIL_PASS
        }
    })

    return transporter
} 

module.exports = { createMailTransporter } 