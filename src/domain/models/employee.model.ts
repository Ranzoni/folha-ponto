import EmployeeError from "../errors/employee.error.js"
import type { WorkSchedule } from "../shared/work-schedule.js"
import { employeeNameIsValid } from "../validators/employee.validator.js"
import { BaseModel } from "./base.model.js"
import type Department from "./department.model.js"
import type Rule from "./rule.model.js"

export default class Employee extends BaseModel {
    private _name: string
    private _workSchedule: WorkSchedule
    private _department: Department
    private _rule: Rule

    constructor(
        name: string,
        workSchedule: WorkSchedule,
        department: Department,
        rule: Rule,
        id?: number,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        super(id, createdAt, updatedAt)

        this._name = name
        this._workSchedule = workSchedule
        this._department = department
        this._rule = rule

        this.validate()
    }

    get name(): string {
        return this._name
    }

    get workSchedule(): WorkSchedule {
        return this._workSchedule
    }

    get department(): Department {
        return this._department
    }

    get rule(): Rule {
        return this._rule
    }

    updateName(name: string): void {
        this._name = name
        this.registerUpdate()
    }

    updateWorkSchedule(workSchedule: WorkSchedule): void {
        this._workSchedule = workSchedule
        this.registerUpdate()
    }

    updateDepartment(department: Department): void {
        this._department = department
        this.registerUpdate()
    }

    updateRule(rule: Rule): void {
        this._rule = rule
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
}