import { ConditionOperator } from "../domain/enums/condition-operator.enum.js"
import Employee from "../domain/models/employee.model.js"
import type IEmployeeRepository from "../domain/repositories/employees-repository.interface.js"
import type { Query } from "../domain/shared/query.js"
import { getMany, getOne, remove, save, update } from "./context-infra.js"
import mapAnyToEmployee from "./mappers/employee.mapper.js"
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
        return mapAnyToEmployee(data)
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