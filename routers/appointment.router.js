const express = require('express')
const appointmentRouter = express.Router();
const controllerAppointment = require('../controllers/appointment.controller')
const controllerUser = require('../controllers/user.controller')
const controllerDoctor = require('../controllers/doctor.controller')
const controllerSchedule = require('../controllers/schedule.controller')
const controllerSlot = require('../controllers/slot.controller')

//Запрос на добавление записи к врачу
// На вход ожидает json в виде:
// {
//     "user_id": "3cdbed16-51b2-4e28-8314-cfe5aa4cf876",
//     "doctor_id": "d6b97bef-e1c1-488e-90d4-c0a15022443c",
//     "date": "19.09.2023",
//     "time": "10:00"
// }
appointmentRouter.post("/add-appointment", async (req, res) => {
    try {
        const appointmentController = new controllerAppointment();
        const userController = new controllerUser();
        const doctorController = new controllerDoctor();
        const scheduleController = new controllerSchedule();
        const slotController = new controllerSlot();

        let time = new Date();
        const hours = req.body.time.split(':')[0];
        const minutes = req.body.time.split(':')[1]
        time.setHours(Number(hours) + 7, Number(minutes), 0, 0);

        //Проверяем существует ли пользователь
        const user = await userController.findUserById(req.body.user_id)
        if (user.length === 0) {
            return res.status(404).json({message: "Такого пациента не существует"})
        }

        //Проверяем существует ли врач
        const doctor = await doctorController.findDoctorById(req.body.doctor_id)
        if (doctor.length === 0) {
            return res.status(404).json({message: "Такого доктора не существует"})
        }

        //Проверяем есть ли у данного врача расписание на заданную дату
        const schedule = await scheduleController.getRecord(req.body.date, req.body.doctor_id)
        if (schedule === null) {
            return res.status(404).json({message: "Нет раписания для врача на заданную дату"})
        }

        //Существует ли слот на который можно записаться с подходящим временем
        const slot = await slotController.getSlot(schedule.id, time.toISOString())
        if (slot === null) {
            return res.status(404).json({message: "Слота на данное время не существует попробуйте что-то в интервале от 9:00 до 18:00"})
        }

        //Существует ли уже такая запись
        const appointment = await appointmentController.findAppointmentBySlot(slot.id)
        if (appointment !== null) {
            return res.status(400).json({message: "Данное время для записи занято"})
        }
        // Проверяем есть ли у пользователя запись в эту же дату в это же время
        const appointmentsByUser = await appointmentController.findAppointmentByUser(user.id)
        for (const elem of appointmentsByUser) {
            const existedSlot = await slotController.getSlotById(elem.slot_id)
            const existedSchedule = await scheduleController.getRecordByDateAndId(existedSlot.schedule_id, req.body.date)

            if (time.getHours() === existedSlot.date_time.getHours() && time.getMinutes() === existedSlot.date_time.getMinutes() && existedSchedule !== null)
                return res.status(400).json({message: "У данного пользователя уже есть встреча на это время, измените желаемое время"})
        }

        //Если все условия выполнены создаём встречу
        const addedAppointment = await appointmentController.addAppointment(user.id, doctor.id, slot.id);
        if (addedAppointment) {
            return res.status(201).json({message: "Запись успешно создана!"})
        } else {
            return res.status(400).json({message: "Попробуйте ещё раз"})
        }
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})


module.exports = appointmentRouter;