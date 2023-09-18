const express = require('express')
const {PrismaClient} = require('@prisma/client')

class UserController {
    async findAllUsers() {
        this.client = new PrismaClient();
        this.client.$connect();
        const allUsers = await this.client.user.findMany();
        this.client.$disconnect();
        return allUsers
    }

    async findUserById(userId) {
        this.client = new PrismaClient();
        this.client.$connect();
        const res = await this.client.user.findFirst({where: {id: userId}})
        this.client.$disconnect();
        return res;
    }

    async addUser(userData) {
        this.client = new PrismaClient();
        this.client.$connect();
        const addedUser = await this.client.user.create({data: {...userData}});
        this.client.$disconnect();
        return addedUser
    }


}

module.exports = UserController;