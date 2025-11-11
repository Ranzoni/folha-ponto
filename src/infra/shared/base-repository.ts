import { EventType } from "../../domain/enums/event-type.enum.js"
import type { BaseModel } from "../../domain/models/base.model.js"
import LogEvent from "../../domain/models/log-event.model.js"
import { save, saveMany } from "../context-infra.js"
import ContextError from "../errors/context.error.js"

type SaveOrUpdateCallback<T extends BaseModel> = (entity: T) => Promise<T | undefined>
type DeleteCallback = (id: number) => Promise<boolean>

export default abstract class BaseRepository<T extends BaseModel> {
    async executeSaveOrUpdate(entity: T, callBack: SaveOrUpdateCallback<T>): Promise<T | undefined> {
        const response = await callBack(entity)
        if (!response)
            ContextError.entityWasNotSaved()

        await saveMany('logEvent', entity.eventsOccurred.map(ev => this.mapLogEventToAny(ev)))
        return response
    }

    async executeDelete(entity: T, callBack: DeleteCallback): Promise<boolean> {
        const entityDeleted = await callBack(entity.id)
        if (!entityDeleted)
            ContextError.entityWasNotSaved()

        await save('logEvent', this.mapLogEventToAny(new LogEvent(entity, EventType.DELETE)))
        return entityDeleted
    }

    protected abstract mapToEntity(data: any): T

    private mapLogEventToAny(logEvent: LogEvent): any {
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