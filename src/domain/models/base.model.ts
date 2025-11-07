import { EventType } from "../enums/event-type.enum.js"
import LogEvent from "./log-event.model.js"

export abstract class BaseModel {
    protected _id: number
    protected _createdAt: Date
    protected _updatedAt?: Date
    private _eventsOccurred: LogEvent[] = []

    constructor(id?: number, createdAt?: Date, updatedAt?: Date) {
        if (id)
            this._id = id
        else
            this._id = 0
        
        this._createdAt = createdAt ? createdAt : new Date()
        
        if (updatedAt)
            this._updatedAt = updatedAt
        
        if (this.isNewEntity)
            this.registerLog(EventType.CREATE)
    }

    get id(): number {
        return this._id
    }

    get createdAt(): Date {
        return this._createdAt
    }

    get updatedAt(): Date | undefined {
        return this._updatedAt
    }

    get eventsOccurred(): LogEvent[] {
        return [...this._eventsOccurred]
    }

    get isNewEntity(): boolean {
        return this._id === 0
    }

    protected registerUpdate(): void {
        this._updatedAt = new Date()
        this.validate()

        this.registerLog(EventType.UPDATE)
    }

    protected abstract validate(): void

    private registerLog(eventType: EventType): void {
        const logEvent = new LogEvent(this, eventType)
        this._eventsOccurred.push(logEvent)
    }
}