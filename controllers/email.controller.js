const nodemailer = require('nodemailer')
const cron = require('node-cron')
const controllerAppointment = require('../controllers/appointment.controller')
const controllerUser = require('../controllers/user.controller')
const controllerDoctor = require('../controllers/doctor.controller')
const controllerSchedule = require('../controllers/schedule.controller')
const controllerSlot = require('../controllers/slot.controller')


class EmailController {
    async sendHours() {
        cron.schedule('0,30 * * * * *', async function () {
            const appointmentController = new controllerAppointment();
            const userController = new controllerUser();
            const doctorController = new controllerDoctor();
            const scheduleController = new controllerSchedule();
            const slotController = new controllerSlot();

            const DateNow = new Date()

            DateNow.setDate(DateNow.getDate())

            const tmp = DateNow.toISOString().split("T")[0]

            const appointments = await appointmentController.getAppointments();
            for (const element of appointments) {

                const slot = await slotController.getSlotById(element.slot_id);
                const date_slotsMas = tmp.split('-');
                const newDate = `${date_slotsMas[2]}.${date_slotsMas[1]}.${date_slotsMas[0]}`

                const schedule = await scheduleController.getRecordByDateAndId(slot.schedule_id, newDate)

                if (schedule !== null) {

                    let timeTmp = new Date();
                    let time = new Date(0);
                    const hours = timeTmp.getHours();
                    const minutes = timeTmp.getMinutes();
                    time.setHours(hours + 2, minutes, 0, 0);

                    const newSlot = await slotController.getSlot(schedule.slot_id, time.toISOString());

                    if (newSlot !== null) {
                        const user = await userController.findUserById(element.user_id)
                        const doctor = await doctorController.findDoctorById(element.doctor_id)

                        const timeString = newSlot.date_time.toISOString().split('T')[1].split(':00.000Z')[0]
                        let transporter = nodemailer.createTransport({
                            pool: true,
                            host: "smtp.yandex.ru",
                            port: 465,
                            auth: {
                                user: process.env.EMAIL_ADDRESS,
                                pass: process.env.EMAIL_PASSWORD
                            }
                        })
                        let result = await transporter.sendMail({
                            from: process.env.EMAIL_ADDRESS,
                            to: process.env.RECIPIENT_ADDRESS,
                            subject: "Запись к врачу",
                            text: `${schedule.date} | Привет ${user.name}! Через 2 часа у вас приём у ${doctor.spec} в ${timeString}!`
                        })
                        console.log("Отправил письмо")
                        console.log(result)
                    }
                }
            }
        })
    }

    async sendDay() {
        cron.schedule('* * 1 * * *', async function () {
            const appointmentController = new controllerAppointment();
            const userController = new controllerUser();
            const doctorController = new controllerDoctor();
            const scheduleController = new controllerSchedule();
            const slotController = new controllerSlot();

            //Определить текущую дату и прибавить два дня
            const timeNow = new Date()

            timeNow.setDate(timeNow.getDate() + 1)

            const tmp = timeNow.toISOString().split("T")[0]

            //Выполнить запрос
            const appointments = await appointmentController.getAppointments();
            for (const element of appointments) {

                const slot = await slotController.getSlotById(element.slot_id);
                const date_slotsMas = tmp.split('-');
                const newDate = `${date_slotsMas[2]}.${date_slotsMas[1]}.${date_slotsMas[0]}`

                const schedule = await scheduleController.getRecordByDateAndId(slot.schedule_id, newDate)

                if (schedule !== null) {

                    const user = await userController.findUserById(element.user_id)
                    const doctor = await doctorController.findDoctorById(element.doctor_id)

                    const timeString = slot.date_time.toISOString().split('T')[1].split(':00.000Z')[0]
                    let transporter = nodemailer.createTransport({
                        pool: true,
                        host: "smtp.yandex.ru",
                        port: 465,
                        auth: {
                            user: process.env.EMAIL_ADDRESS,
                            pass: process.env.EMAIL_PASSWORD
                        }
                    })
                    let result = await transporter.sendMail({
                        from: process.env.EMAIL_ADDRESS,
                        to: process.env.RECIPIENT_ADDRESS,
                        subject: "Запись к врачу",
                        text: `${schedule.date} | Привет ${user.name}! Напоминаем что вы записаны к ${doctor.spec} у завтра в ${timeString}!`
                    })
                    console.log("Отправил письмо")
                    console.log(result)
                }
            }
        })
    }
}

module.exports = EmailController;