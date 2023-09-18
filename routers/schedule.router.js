const express = require('express')
const scheduleRouter = express.Router();

const controllerAppointment = require('../controllers/appointment.controller')
const controllerUser = require('../controllers/user.controller')
const controllerDoctor = require('../controllers/doctor.controller')
const controllerSchedule = require('../controllers/schedule.controller')
const controllerSlot = require('../controllers/slot.controller')

//Запрос для создания расписания для доктора на определённую дату
//На вход ожидает json в виде:
// {
//     "doctor_id": "d6b97bef-e1c1-488e-90d4-c0a15022443c",
//     "date": "19.09.2023"
// }
scheduleRouter.post("/create-record", async (req, res) => {
    try {
        const scheduleController = new controllerSchedule();
        const schedule = await scheduleController.getRecords(req.body.date)

        if (schedule.length > 0) {
            for (const elem of schedule) {
                if (elem.doctor_id === req.body.doctor_id) {
                    console.log(elem.doctor_id === req.doctor_id)
                    return res.status(400).json({message: "Расписание на задданную дату уже создано"})
                }
            }
        }
        const addedSchedule = await scheduleController.createRecord(req.body.doctor_id, req.body.date)
        if (addedSchedule)
            return res.status(201).json(addedSchedule);
        else {
            return res.status(400).json({message: "Поробуйте еще раз"})
        }
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
})

//Запрос на получение расписания всех докторов на заданную дату
//На вход ожидает json в виде:
// {
//     "date": "19.09.2023"
// }
scheduleRouter.get("/get-records", async (req, res) => {
    try {
        const appointmentController = new controllerAppointment();
        const userController = new controllerUser();
        const doctorController = new controllerDoctor();
        const scheduleController = new controllerSchedule();
        const slotController = new controllerSlot();

        let resultArray = []
        //Проверяем есть ли записи в расписании на данную дату
        const schedule = await scheduleController.getRecords(req.body.date)
        if (schedule === undefined || schedule.length === 0) {
            return res.status(404).json({message: `Расписание на заданную дату ещё не назначено`})
        }
        for (const element of schedule) {
            //Для каждой записи из расписания, если таковые нашлись
            //Находим доктора, для которого была создана запись
            const doctor = await doctorController.findDoctorById(element.doctor_id)
            //и встречи с пользователями
            const appointment = await appointmentController.findAppointmentByDoctor(element.doctor_id)

            //Если встречи не нашлись значит расписание для доктора свободно
            if (appointment === undefined || appointment.length === 0) {
                resultArray.push(`Похоже расписание врача ${doctor.name} полностью свободно на эту дату.`)
            } else {
                //Если встречи были найдены, тогда для каждой встречи находим пользователя, который на неё записан
                //И находим слот времени, на который создана встреча и показываем эти данные
                for (const elem of appointment) {
                    const user = await userController.findUserById(elem.user_id)
                    const slot = await slotController.getSlotById(elem.slot_id)
                    if (slot.schedule_id === element.id)
                        resultArray.push(`Встреча врача ${doctor.name} с ${user.name} в ${slot.date_time.toISOString().split("T")[1].split(":00.000Z")[0]}`)
                }
            }

        }
        //Выводим массив с сообщениями о встречах на заданную дату
        if (resultArray !== [])
            return res.status(200).json(resultArray)
        else {
            return res.status(400).json({message: "Поробуйте еще раз"})
        }

    } catch (error) {
        return res.status(400).json({message: error.message});
    }
})

module.exports = scheduleRouter;