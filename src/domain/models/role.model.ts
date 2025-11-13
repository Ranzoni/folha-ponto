import RoleError from "../errors/role.error.js"
import { roleNameIsValid } from "../validators/role.validator.js"
import { BaseModel } from "./base.model.js"

export default class Role extends BaseModel {
    private _name: string
    
    constructor(name: string, id?: number, createdAt?: Date, updatedAt?: Date) {
        super(id, createdAt, updatedAt)
        
        this._name = name

        this.validate()
    }
    
    get name(): string {
        return this._name
    }

    update(name: string): void {
        this._name = name
        this.registerUpdate()
    }
    
    protected validate(): void {
        if (!roleNameIsValid(this.name))
            RoleError.invalidName()
    }
}