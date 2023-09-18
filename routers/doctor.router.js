const express = require('express')

const doctorRouter = express.Router();

const controller = require('../controllers/doctor.controller')

//Запрос на добавление доктора в базу
// На вход ожидает json в виде:
// {
//     "name": "Иван",
//     "spec": "Терапевт"
// }
doctorRouter.post("/add-doctor", async (req, res) => {
    try {
        const controllerInstance = new controller();
        const addedDoctor = await controllerInstance.addDoctor(req.body)
        if (addedDoctor !== null)
            return res.status(201).json(addedDoctor);
        else {
            return res.status(400).json({message: "Поробуйте еще раз"})
        }
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
})

//Запрос на добавление предзаготовленных докторов в базу
//На вход ничего не ожидается
doctorRouter.post("/add-doctors", async (req, res) => {
    try {
        const dataDoctors = [
            {name: "Иван", spec: "Терапевт"},
            {name: 'Сергей', spec: "Окулист"},
            {name: 'Игорь', spec: "Офтальмолог"},
            {name: "Виктор", spec: "Хирург"},
            {name: "Виталий", spec: "Терапевт"},
            {name: "Вячеслав", spec: "Хирург"}
        ]
        const controllerInstance = new controller();
        for (const elem of dataDoctors) {
            await controllerInstance.addDoctor(elem);
        }
        return res.status(201).json({message: "Данные докторов успешно добавлены."})
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
})

module.exports = doctorRouter;