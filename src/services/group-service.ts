import type { FilterRequest } from "../api/models/filter.request.js"
import type { GroupRequest, GroupResponse } from "../api/models/group.response.js"
import { ConditionOperator } from "../domain/enums/condition-operator.enum.js"
import EmployeeError from "../domain/errors/employee.error.js"
import GroupError from "../domain/errors/group.error.js"
import RoleError from "../domain/errors/role.error.js"
import type Employee from "../domain/models/employee.model.js"
import { Group } from "../domain/models/group.model.js"
import type Role from "../domain/models/role.model.js"
import type IEmployeeRepository from "../domain/repositories/employees-repository.interface.js"
import type IGroupRepository from "../domain/repositories/group-repository.interface.js"
import type IRoleRepository from "../domain/repositories/roles-repository.interface.js"
import { Query } from "../domain/shared/query.js"
import mapToGroupResponse from "./mappers/group.mapper.js"
import { mapToQuery } from "./mappers/query.mapper.js"

export default class GroupService {
    private _groupRepository: IGroupRepository
    private _employeeRepository: IEmployeeRepository
    private _roleRepository: IRoleRepository

    constructor(groupRepository: IGroupRepository, employeeRepository: IEmployeeRepository, roleRepository: IRoleRepository) {
        this._groupRepository = groupRepository
        this._employeeRepository = employeeRepository
        this._roleRepository = roleRepository
    }

    async createGroup(request: GroupRequest): Promise<GroupResponse | undefined> {
        const employees = await this.getEmployees(request.employeesIds)
        this.validateEmployeesInformed(request.employeesIds, employees)

        const roles = await this.getRoles(request.rolesIds)
        this.validateRolesInformed(request.rolesIds, roles)

        await this.validateGroupRegister(request.name)

        const group = new Group(request.name, [], employees, roles)
        const groupCreated = await this._groupRepository.save(group)
        if (!groupCreated)
            throw new GroupError('Falha ao recuperar o grupo criado.')

        return mapToGroupResponse(groupCreated)
    }

    async updateGroup(id: number, request: GroupRequest): Promise<GroupResponse | undefined> {
        const employees = await this.getEmployees(request.employeesIds)
        this.validateEmployeesInformed(request.employeesIds, employees)

        const roles = await this.getRoles(request.rolesIds)
        this.validateRolesInformed(request.rolesIds, roles)

        await this.validateGroupRegister(request.name)

        const group = await this._groupRepository.get(id)
        if (!group)
            GroupError.notFound()

        if (request.name != group!.name)
            group!.update(request.name)

        this.updateEmployeesMembers(group!, employees)
        this.updateRolesMembers(group!, roles)

        const groupUpdated = await this._groupRepository.update(group!)
        if (!groupUpdated)
            throw new GroupError('Falha ao recuperar o grupo criado.')

        return mapToGroupResponse(groupUpdated)
    }

    async removeGroup(id: number): Promise<void> {
        const group = await this._groupRepository.get(id)
        if (!group)
            GroupError.notFound()

        const removed = await this._groupRepository.delete(group!)
        if (!removed)
            throw new GroupError('Falha ao remover o grupo.')
    }

    async searchGroup(id: number): Promise<GroupResponse | undefined> {
        const group = await this._groupRepository.get(id)
        if (!group)
            return undefined

        return mapToGroupResponse(group)
    }

    async searchGroups(filter: FilterRequest): Promise<GroupResponse[]> {
        const query = mapToQuery(filter)
        const groups = await this._groupRepository.getMany(query.query)
        return groups.map(group => mapToGroupResponse(group))
    }

    private updateEmployeesMembers(group: Group, employees: Employee[]): void {
        if (employees.length === 0)
            return

        group.removeEmployees(employees.map(employee => employee.id))
        group.addEmployees(employees)
    }

    private updateRolesMembers(group: Group, roles: Role[]): void {
        if (roles.length === 0)
            return

        group.removeRoles(roles.map(role => role.id))
        group.addRoles(roles)
    }

    private buildFilterIdsQuery(ids: number[]): Query {
        const query = new Query(1, ids.length)
        query.addCondition('id', ConditionOperator.IN, ids)
        return query
    }

    private async getEmployees(employeesIds: number[]): Promise<Employee[]> {
        return await this._employeeRepository.getMany(this.buildFilterIdsQuery(employeesIds))
    }

    private async getRoles(rolesIds: number[]): Promise<Role[]> {
        return await this._roleRepository.getMany(this.buildFilterIdsQuery(rolesIds))
    }

    private validateEmployeesInformed(employeesIds: number[], employees: Employee[]) {
        const employeesNotFound = employeesIds.filter(employeeId => {
            if (!employees.find(employee => employee.id === employeeId))
                return employeeId
        })

        if (employeesNotFound.length > 0)
            EmployeeError.idsNotFound(employeesNotFound)
    }

    private validateRolesInformed(rolesIds: number[], roles: Role[]) {
        const rolesNotFound = rolesIds.filter(roleId => {
            if (!roles.find(role => role.id === roleId))
                return roleId
        })

        if (rolesNotFound.length > 0)
            RoleError.idsNotFound(rolesNotFound)
    }

    private async validateGroupRegister(name: string, idToIgnore?: number) {
        const groupFound = await this._groupRepository.getByName(name, idToIgnore)
        if (groupFound)
            GroupError.alreadyExists()
    }
}