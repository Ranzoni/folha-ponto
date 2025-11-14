import EmployeeError from "../errors/employee.error.js"
import type { IWorkSchedule } from "../shared/interfaces/work-schedule.interface.js"
import { WorkScheduleItem, WorkSchedule } from "../shared/work-schedule.model.js"
import { employeeNameIsValid } from "../validators/employee.validator.js"
import { BaseModel } from "./base.model.js"
import type Department from "./department.model.js"
import type Role from "./role.model.js"

export default class Employee extends BaseModel {
    private _name: string
    private _workSchedule: WorkSchedule
    private _department: Department
    private _role: Role
    private _active: boolean

    constructor(
        name: string,
        workSchedule: WorkSchedule,
        department: Department,
        role: Role,
        id?: number,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        super(id, createdAt, updatedAt)

        this._name = name
        this._workSchedule = workSchedule
        this._department = department
        this._role = role
        this._active = true

        this.validate()
    }

    get name(): string {
        return this._name
    }

    get workSchedule(): IWorkSchedule {
        return this._workSchedule
    }

    get department(): Department {
        return this._department
    }

    get role(): Role {
        return this._role
    }

    get active(): boolean {
        return this._active
    }

    updateName(name: string): void {
        this._name = name
        this.registerUpdate()
    }

    addFirstPeriod(firstPeriod: WorkScheduleItem): void {
        this._workSchedule.updateFirstPeriod(firstPeriod)
        this.registerUpdate()
    }

    addLunch(lunch: WorkScheduleItem): void {
        this._workSchedule.updateLunch(lunch)
        this.registerUpdate()
    }

    removeLunch(): void {
        this._workSchedule.removeLunch()
        this.registerUpdate()
    }

    addSecondPeriod(secondPeriod: WorkScheduleItem): void {
        this._workSchedule.updateSecondPeriod(secondPeriod)
        this.registerUpdate()
    }

    removeSecondPeriod(): void {
        this._workSchedule.removeSecondPeriod()
        this.registerUpdate()
    }

    updateDepartment(department: Department): void {
        this._department = department
        this.registerUpdate()
    }

    updateRole(role: Role): void {
        this._role = role
        this.registerUpdate()
    }

    activate(value: boolean): void {
        this._active = value
        this.registerUpdate()
    }

    protected validate(): void {
        if (!employeeNameIsValid(this._name))
            EmployeeError.invalidName()

        if (!this._workSchedule)
            EmployeeError.workScheduleNotInformed()

        if (!this._department)
            EmployeeError.departmentNotInformed()

        if (!this.role)
            EmployeeError.roleNotInformed()
    }
}