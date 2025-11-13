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

    get rule(): Role {
        return this._role
    }

    updateName(name: string): void {
        this._name = name
        this.registerUpdate()
    }

    addFirstPeriod(start: number, end: number): void {
        this.addPeriod(start, end, this._workSchedule.updateFirstPeriod)
    }

    addLunch(start: number, end: number): void {
        this.addPeriod(start, end, this._workSchedule.updateLunch)
    }

    removeLunch(): void {
        this.removePeriod(this._workSchedule.removeLunch)
    }

    addSecondPeriod(start: number, end: number): void {
        this.addPeriod(start, end, this._workSchedule.updateSecondPeriod)
    }

    removeSecondPeriod(): void {
        this.removePeriod(this._workSchedule.removeSecondPeriod)
    }

    updateDepartment(department: Department): void {
        this._department = department
        this.registerUpdate()
    }

    updateRule(rule: Role): void {
        this._role = rule
        this.registerUpdate()
    }

    protected validate(): void {
        if (!employeeNameIsValid(this._name))
            EmployeeError.invalidName()

        if (!this._workSchedule)
            EmployeeError.workScheduleNotInformed()

        if (!this._department)
            EmployeeError.departmentNotInformed()

        if (!this.rule)
            EmployeeError.ruleNotInformed()
    }

    private addPeriod(start: number, end: number, periodAction: (period: WorkScheduleItem) => void): void {
        const period = new WorkScheduleItem(start, end)
        periodAction(period)
        this.registerUpdate()
    }

    private removePeriod(periodAction: () => void): void {
        periodAction()
        this.registerUpdate()
    }
}