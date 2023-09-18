const express = require('express')

const slotRouter = express.Router();

const controller = require("../controllers/slot.controller");

//Создать слоты времени для врача на определённую дату
//Слоты создаются на конкретную дату и конкретного врача
//Не получится создать слоты если не задана запись в schedule для врача
//На вход ожидает json в виде
// {
//     "schedule_id": "e9f39200-e731-4715-b439-e7f34960d8bf"
// }
slotRouter.post("/create-slots", async (req, res) => {
    try {
        const timeMassive = ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
            '16:00', '16:30', '17:00', '17:30', '18:00']

        const controllerInstance = new controller();

        //Смотрим есть ли слоты для данной записи в расписании, если есть выводим сообщение об ошибке
        const slots = await controllerInstance.getSlotsBySchedule(req.body.schedule_id)
        if(slots.length !== 0) {
            return res.status(400).json({message: "Слоты для этой записи уже заполнены"})
        }
        //Задаём слотам время и прикрепляем их к записи в расписании
        for (const elem of timeMassive) {
            const time = new Date();
            const hours = elem.split(':')[0];
            const minutes = elem.split(':')[1];
            time.setHours(Number(hours) + 7, Number(minutes), 0, 0);
            await controllerInstance.createSlots(time, req.body.schedule_id);
        }
        return res.status(201).json({message: "Слоты успешно заполнены."})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
})

module.exports = slotRouter;