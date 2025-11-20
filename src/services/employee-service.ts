import type { EmployeeRequest, EmployeeResponse, WorkScheduleRequestOrResponse } from "../api/models/employee.response.js"
import type { FilterRequest } from "../api/models/filter.request.js"
import DepartmentError from "../domain/errors/department.error.js"
import EmployeeError from "../domain/errors/employee.error.js"
import RoleError from "../domain/errors/role.error.js"
import Department from "../domain/models/department.model.js"
import Employee from "../domain/models/employee.model.js"
import type Role from "../domain/models/role.model.js"
import type IDepartmentRepository from "../domain/repositories/departments-repository.interface.js"
import type IEmployeeRepository from "../domain/repositories/employees-repository.interface.js"
import type IRoleRepository from "../domain/repositories/roles-repository.interface.js"
import mapToEmployeeResponse from "./mappers/employee.mapper.js"
import { mapToQuery } from "./mappers/query.mapper.js"
import { mapToWorkSchedule } from "./mappers/work-schedule.mapper.js"

export default class EmployeeService {
    private _employeeRepository: IEmployeeRepository
    private _departmentRepository: IDepartmentRepository
    private _roleRepository: IRoleRepository
    
    constructor(
        employeeRepository: IEmployeeRepository,
        departmentRepository: IDepartmentRepository,
        roleRepository: IRoleRepository
    ) {
        this._employeeRepository = employeeRepository
        this._departmentRepository = departmentRepository
        this._roleRepository = roleRepository
    }

    async createEmployee(request: EmployeeRequest): Promise<EmployeeResponse | undefined> {
        const department = await this._departmentRepository.get(request.departmentId)
        const role = await this._roleRepository.get(request.roleId)

        this.validateEmployeeRegister(department, role)

        const workSchedule = mapToWorkSchedule(request.workSchedule)

        const employee = new Employee(request.name, workSchedule, department!, role!)
        const employeeCreated = await this._employeeRepository.save(employee)
        if (!employeeCreated)
            throw new EmployeeError('Falha ao recuperar o funcionário criado.')

        return mapToEmployeeResponse(employeeCreated)
    }

    async updateEmployee(id: number, request: EmployeeRequest): Promise<EmployeeResponse | undefined> {
        const department = await this._departmentRepository.get(request.departmentId)
        const role = await this._roleRepository.get(request.roleId)

        this.validateEmployeeRegister(department, role)

        const employee = await this._employeeRepository.get(id)
        if (!employee)
            EmployeeError.notFound()

        if (request.name != employee!.name)
            employee!.updateName(request.name)

        this.updateWorkSchedule(request.workSchedule, employee!)

        if (request.departmentId != employee!.department.id)
            employee!.updateDepartment(department!)

        if (request.roleId != employee!.role.id)
            employee!.updateRole(role!)

        const employeeUpdated = await this._employeeRepository.update(employee!)
        if (!employeeUpdated)
            throw new EmployeeError('Falha ao recuperar o funcionário alterado.')

        return mapToEmployeeResponse(employeeUpdated!)
    }

    async removeEmployee(id: number): Promise<void> {
        const employee = await this._employeeRepository.get(id)
        if (!employee) 
            EmployeeError.notFound()
        
        const removed = await this._employeeRepository.delete(employee!)
        if (!removed)
            throw new EmployeeError('Falha ao remover o funcionário.')
    }

    async activate(id: number, active: boolean): Promise<void> {
        const employee = await this._employeeRepository.get(id)
        if (!employee) 
            EmployeeError.notFound()

        employee!.activate(active)
        const employeeUpdated = await this._employeeRepository.update(employee!)
        if (!employeeUpdated)
            throw new EmployeeError('Falha ao alterar o estado do funcionário.')
    }
    
    async searchEmployee(id: number): Promise<EmployeeResponse | undefined> {
        const employee = await this._employeeRepository.get(id)
        if (!employee)
            return undefined
        
        return mapToEmployeeResponse(employee)
    }
    
    async searchEmployees(filter: FilterRequest): Promise<EmployeeResponse[]> {
        const query = mapToQuery(filter)
        const employees = await this._employeeRepository.getMany(query.query)
        return employees.map(employee => mapToEmployeeResponse(employee))
    }

    private validateEmployeeRegister(department: Department | undefined, role: Role | undefined): void {
        if (!department)
            DepartmentError.notFound()

        if (!role)
            RoleError.notFound()
    }
    
    private updateWorkSchedule(workScheduleRequest: WorkScheduleRequestOrResponse, employee: Employee): void {
        const workSchedule = mapToWorkSchedule(workScheduleRequest)

        if (!employee.workSchedule.firstPeriod.isEqual(workSchedule.firstPeriod))
            employee.addFirstPeriod(workSchedule.firstPeriod)

        if (!employee.workSchedule.lunch?.isEqual(workSchedule.lunch)) {
            if (workSchedule.lunch)
                employee.addLunch(workSchedule.lunch)
            else
                employee.removeLunch()
        }

        if (!employee.workSchedule.secondPeriod?.isEqual(workSchedule.secondPeriod)) {
            if (workSchedule.secondPeriod)
                employee.addSecondPeriod(workSchedule.secondPeriod)
            else
                employee.removeSecondPeriod()
        }
    }
}