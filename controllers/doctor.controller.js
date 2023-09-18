const express = require('express')
const {PrismaClient} = require('@prisma/client')

class DoctorController {

    async findDoctorById(doctorId) {
        this.client = new PrismaClient();
        this.client.$connect();
        const res = await this.client.doctor.findFirst({where: {id: doctorId}})
        this.client.$disconnect();
        return res;
    }

    async addDoctor(doctorData) {
        this.client = new PrismaClient();
        this.client.$connect();

        const addedDoctor = await this.client.doctor.create({
            data: {...doctorData}
        });
        this.client.$disconnect()
        return addedDoctor
    }


}

module.exports = DoctorController;