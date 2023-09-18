const express = require('express')
const {PrismaClient} = require('@prisma/client')

class SlotController {
    async getSlotsBySchedule(schedule_id) {
        this.client = new PrismaClient();
        this.client.$connect();
        const res = await this.client.slot.findMany({
            where: {
                schedule_id: schedule_id
            }
        });
        this.client.$disconnect();
        return res;
    }

    async getSlotById(slot_id) {
        this.client = new PrismaClient();
        this.client.$connect();
        const res = await this.client.slot.findFirst({
            where: {
                id: slot_id
            }
        });
        this.client.$disconnect();
        return res;
    }
    async getSlot(schedule_id, time) {
        this.client = new PrismaClient();
        this.client.$connect();
        const res = await this.client.slot.findFirst({
            where: {
                AND: {
                    schedule_id: schedule_id,
                    date_time: time
                }
            }
        });
        this.client.$disconnect();
        return res;
    }
    async createSlots(time, scheduleId) {
        this.client = new PrismaClient();
        this.client.$connect();
        const res = await this.client.slot.create({data: {date_time: time.toISOString(), schedule_id: scheduleId}});
        this.client.$disconnect();
        return res
    }

}

module.exports = SlotController;