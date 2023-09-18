const express = require('express')
const EmailController = require("./controllers/email.controller")
require('dotenv').config()
const port = 3000

const app = express();
app.use(express.json())
app.use('/user', require('./routers/user.router'))
app.use('/doctor', require('./routers/doctor.router'))
app.use('/slot', require('./routers/slot.router'))
app.use('/schedule', require('./routers/schedule.router'))
app.use('/appointment', require('./routers/appointment.router'))

function RunApp() {

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
        const controller = new EmailController()
        controller.sendHours();
        controller.sendDay()
    })
}

RunApp();