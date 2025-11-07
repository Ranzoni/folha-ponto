import type { EventType } from "../enums/event-type.enum.js"
import LogEventError from "../errors/log-event.error.js"
import { contentIsEmpty } from "../validators/log-event.validator.js"

export default class LogEvent {
    private _id: number
    private _content: any
    private _eventType: EventType
    private _dateOccurred: Date

    constructor(content: any, eventType: EventType) {
        this._id = 0
        this._content = content
        this._eventType = eventType
        this._dateOccurred = new Date()

        if (contentIsEmpty(this._content))
            LogEventError.invalidContent()
    }

    get id(): number {
        return this._id
    }

    get content(): string {
        return this._content
    }

    get eventType(): EventType {
        return this._eventType
    }

    get dateOccurred(): Date {
        return this._dateOccurred
    }
}