import DepartmentError from "../errors/department.error.js"
import { departmentNameIsValid } from "../validators/department.validator.js"
import { BaseModel } from "./base.model.js"

export default class Department extends BaseModel {
    private _name: string

    constructor(name: string, id?: number, createdAt?: Date, updatedAt?: Date) {
        super(id, createdAt, updatedAt)

        this._name = name

        this.validate()
    }

    get name(): string {
        return this._name
    }

    protected validate(): void {
        if (departmentNameIsValid(this._name))
            DepartmentError.invalidName()
    }
}