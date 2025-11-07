import { EventType } from "../../domain/enums/event-type.enum.js"
import type { BaseModel } from "../../domain/models/base.model.js"
import LogEvent from "../../domain/models/log-event.model.js"
import { PrismaClient } from "../../generated/prisma/client.js"

type SaveOrUpdateCallback<T extends BaseModel> = (entity: T) => Promise<T | undefined>
type DeleteCallback = (id: number) => Promise<boolean>

export default class BaseRepository<T extends BaseModel> {
    protected _prisma = new PrismaClient()

    async executeSaveOrUpdate(entity: T, callBack: SaveOrUpdateCallback<T>): Promise<T | undefined> {
        const teste = entity.eventsOccurred.map(ev => this.mapToPrismaCreate(ev))
        const response = await callBack(entity)
        await this._prisma.logEvent.createMany({
            data: entity.eventsOccurred.map(ev => this.mapToPrismaCreate(ev))
        })

        return response
    }

    async executeDelete(entity: T, callBack: DeleteCallback): Promise<boolean> {
        const entityDeleted = await callBack(entity.id)
        await this._prisma.logEvent.create({
            data: this.mapToPrismaCreate(new LogEvent(entity, EventType.DELETE))
        })

        return entityDeleted
    }

    private mapToPrismaCreate(logEvent: LogEvent): any {
        return {
            content: JSON.stringify(this.handleEntity(logEvent.content)),
            eventType: logEvent.eventType,
            dateOccurred: logEvent.dateOccurred
        }
    }

    private handleEntity(content: any) {
        const { _eventsOccurred, ...rest } = content as any
        return rest
    }
}