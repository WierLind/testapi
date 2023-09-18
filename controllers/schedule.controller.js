const express = require('express')
const {PrismaClient} = require('@prisma/client')

class ScheduleController {
    async createRecord(doctor_id, date) {
        this.client = new PrismaClient();
        this.client.$connect();
        const res = await this.client.schedule.create({
            data: {
                doctor_id: doctor_id,
                date: date,
            }
        })
        this.client.$disconnect();
        return res
    }

    async getRecord(date, doctorId) {
        this.client = new PrismaClient();
        this.client.$connect();
        const res = await this.client.schedule.findFirst({
            where: {
                AND: {
                    doctor_id: doctorId,
                    date: date
                }
            }
        })
        this.client.$disconnect();
        return res
    }

    async getRecords(date) {
        this.client = new PrismaClient();
        this.client.$connect();
        const res = await this.client.schedule.findMany({
            where: {
                date: date
            }
        })
        this.client.$disconnect();
        return res
    }

    async getRecordByDateAndId(id, date) {
        this.client = new PrismaClient();
        this.client.$connect();
        const res = await this.client.schedule.findFirst({
            where: {
                AND: {
                    id: id,
                    date: date
                }
            }
        })
        this.client.$disconnect();
        return res
    }
}

module.exports = ScheduleController;