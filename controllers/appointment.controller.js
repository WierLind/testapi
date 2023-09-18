const express = require('express')
const {PrismaClient} = require('@prisma/client')

class AppointmentController {
    async addAppointment(userId, doctorId, slotId) {
        this.client = new PrismaClient();
        this.client.$connect();

        const newAppointment = await this.client.appointment.create({
            data: {
                user_id: userId,
                doctor_id: doctorId,
                slot_id: slotId
            }
        });
        this.client.$disconnect()
        return newAppointment
    }

    async getAppointments() {
        this.client = new PrismaClient();
        this.client.$connect();
        const appointments = await this.client.appointment.findMany();
        this.client.$disconnect()
        return appointments
    }

    async findAppointmentBySlot(slotId) {
        this.client = new PrismaClient();
        this.client.$connect();
        const res = await this.client.appointment.findFirst({where: {slot_id: slotId}})
        this.client.$disconnect();
        return res;
    }
    async findAppointmentByDoctor(doctorId) {
        this.client = new PrismaClient();
        this.client.$connect();
        const res = await this.client.appointment.findMany({where: {doctor_id: doctorId}})
        this.client.$disconnect();
        return res;
    }
    async findAppointmentByUser(userId) {
        this.client = new PrismaClient();
        this.client.$connect();
        const res = await this.client.appointment.findMany({where: {user_id: userId}})
        this.client.$disconnect();
        return res;
    }

}

module.exports = AppointmentController;