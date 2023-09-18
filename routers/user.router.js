const express = require('express')
const {check, validationResult} = require('express-validator')

const userRouter = express.Router();

const controller = require('../controllers/user.controller')

//Запрос на получение списка пользователей
userRouter.get("/get-all-users", async (req, res) => {
    try {
        const controllerInstance = new controller();
        const users = await controllerInstance.findAllUsers()
        if (users.length !== 0)
            return res.status(201).json(users);
        else {
            return res.status(400).json({message: "Поробуйте еще раз"})
        }
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
})

//Запрос на добавление пользователя
//На вход ожидает json в виде:
// {
//     "phone": "89137993085",
//     "name": "Oleg3",
//     "email": "oleg3@mail.ru"
// }
userRouter.post("/add-user", [
    check("phone", "Неверный номер телефона").notEmpty().isLength({min: 11, max: 13}),
    check("name", "Неправильное имя").notEmpty(),
    check("email", "Неправильный формат почты").notEmpty().isEmail(),
], async (req, res) => {
    try {
        const controllerInstance = new controller();
        const errors = await validationResult(req)

        if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.array(),
                message: errors.array()[0].msg
            })

        const addedUser = await controllerInstance.addUser(req.body)

        if (addedUser)
            return res.status(201).json(addedUser);
        else {
            return res.status(400).json({message: "Поробуйте еще раз"})
        }
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
})

userRouter.post("/add-users", async (req, res) => {
    try {
        const dataUsers = [
            {phone: "89137993083", name: "Иван", email: "ivan@mail.ru"},
            {phone: "89137993084", name: "Игорь", email: "igor@mail.ru"},
            {phone: "89137993085", name: "Артём", email: "artyom@mail.ru"},
            {phone: "89137993086", name: "Сергей", email: "sergey@mail.ru"},
        ]
        const controllerInstance = new controller();
        for (const elem of dataUsers) {
            await controllerInstance.addUser(elem);
        }
        return res.status(201).json({message: "Данные пользователей успешно добавлены."})
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
})

module.exports = userRouter;