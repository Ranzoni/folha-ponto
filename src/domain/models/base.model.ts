export abstract class BaseModel {
    protected _id: number = 0
    protected _createdAt: Date
    protected _updatedAt?: Date

    constructor(id?: number, createdAt?: Date, updatedAt?: Date) {
        if (id)
            this._id = id

        this._createdAt = createdAt ? createdAt : new Date()
        
        if (updatedAt)
            this._updatedAt = updatedAt
    }

    id(): number {
        return this._id
    }

    createdAt(): Date {
        return this._createdAt
    }

    updatedAt(): Date | undefined {
        return this._updatedAt
    }

    protected registerUpdate(): void {
        this._updatedAt = new Date()
        this.validate()
    }

    protected abstract validate(): void
}