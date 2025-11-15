import { ConditionOperator } from "../domain/enums/condition-operator.enum.js"
import Employee from "../domain/models/employee.model.js"
import type IEmployeeRepository from "../domain/repositories/employees-repository.interface.js"
import type { Query } from "../domain/shared/query.js"
import { WorkSchedule, WorkScheduleItem } from "../domain/shared/work-schedule.model.js"
import { getMany, getOne, remove, save, update } from "./context-infra.js"
import mapAnyToDepartment from "./mappers/department.mapper.js"
import mapAnyToRole from "./mappers/role.mapper.js"
import BaseRepository from "./shared/base-repository.js"

export default class EmployeeRepository extends BaseRepository<Employee> implements IEmployeeRepository {

    async save(entity: Employee): Promise<Employee | undefined> {
        return await this.executeSaveOrUpdate(entity, async (employee) => {
            const data = this.buildSaveOrUpdateData(employee)

            data['createdAt'] = employee.createdAt

            const employeeCreated = await save('employee', data)
            if (!employeeCreated)
                return undefined

            return this.mapToEntity(employeeCreated)
        })
    }

    async update(entity: Employee): Promise<Employee | undefined> {
        return await this.executeSaveOrUpdate(entity, async (employee) => {
            const data = this.buildSaveOrUpdateData(employee)

            if (employee.updatedAt)
                data['updatedAt'] = employee.updatedAt

            const employeeAltered = await update('employee', employee.id, data)
            if (!employeeAltered)
                return undefined

            return this.mapToEntity(employeeAltered)
        })
    }

    async delete(entity: Employee): Promise<boolean> {
        return await this.executeDelete(entity, async (id) => {
            const employeeDeleted = await remove('employee', id)
            return !!employeeDeleted
        })
    }

    async get(id: number): Promise<Employee | undefined> {
        const employee = await getOne('employee', {
            id
        })

        if (!employee)
            return undefined

        return this.mapToEntity(employee)
    }

    async getMany(query: Query): Promise<Employee[]> {
        query.addCondition('active', ConditionOperator.EQUALS, true)
        return this.getManyEmployees(query)
    }

    async getIncludingDeactivated(id: number): Promise<Employee | undefined> {
        const employee = await getOne('employee', {
            id,
            activate: true
        })

        if (!employee)
            return undefined

        return this.mapToEntity(employee)
    }

    async getManyIncludingDeactivated(query: Query): Promise<Employee[]> {
        return this.getManyEmployees(query)
    }
    
    protected mapToEntity(data: any): Employee {
        const firstPeriod = new WorkScheduleItem(data.firstPeriodStart, data.firstPeriodEnd)
        
        let lunch: WorkScheduleItem | undefined = undefined
        if (data.lunchPeriodStart && data.lunchPeriodEnd)
            lunch = new WorkScheduleItem(data.lunchPeriodStart, data.lunchPeriodEnd)

        let secondPeriod: WorkScheduleItem | undefined = undefined
        if (data.secondPeriodStart && data.secondPeriodEnd)
            secondPeriod = new WorkScheduleItem(data.secondPeriodStart, data.secondPeriodEnd)

        const workSchedule = new WorkSchedule(firstPeriod, lunch, secondPeriod)

        const department = mapAnyToDepartment(data.department)
        const role = mapAnyToRole(data.role)

        return new Employee(
            data.name,
            workSchedule,
            department,
            role,
            data.id,
            data.createdAt,
            data.updatedAt
        )
    }

    private buildSaveOrUpdateData(employee: Employee): any {
        const data: any = {
            name: employee.name,
            firstPeriodStart: employee.workSchedule.firstPeriod.start,
            firstPeriodEnd: employee.workSchedule.firstPeriod.end,
            departmentId: employee.department.id,
            roleId: employee.role.id,
            active: employee.active
        }

        if (employee.workSchedule.lunch) {
            data['lunchPeriodStart'] = employee.workSchedule.lunch.start,
            data['lunchPeriodEnd'] = employee.workSchedule.lunch.end
        }

        if (employee.workSchedule.secondPeriod) {
            data['secondPeriodStart'] = employee.workSchedule.secondPeriod.start,
            data['secondPeriodEnd'] = employee.workSchedule.secondPeriod.end
        }

        return data
    }

    private async getManyEmployees(query: Query): Promise<Employee[]> {
        const employees = await getMany('employee', query)
        return employees.map(employee => this.mapToEntity(employee))
    }
}