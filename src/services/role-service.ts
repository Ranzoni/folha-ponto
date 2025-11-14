import RoleError from "../domain/errors/role.error.js"
import Role from "../domain/models/role.model.js"
import { mapToQuery } from "./mappers/query.mapper.js"
import mapToRoleResponse from "./mappers/role.mapper.js"
import type { FilterRequest } from "../api/models/filter.request.js"
import type IRoleRepository from "../domain/repositories/roles-repository.interface.js"
import type { RoleResponse } from "../api/models/role.response.js"

export default class RoleService {
    private _roleRepository: IRoleRepository

    constructor(roleRepository: IRoleRepository) {
        this._roleRepository = roleRepository     
    }

    async createRole(name: string): Promise<RoleResponse | undefined> {
        await this.validateRoleRegister(name)

        const role = new Role(name)
        const roleCreated = await this._roleRepository.save(role)
        if (!roleCreated)
            throw new RoleError('Fail to recover the role created.')

        return mapToRoleResponse(roleCreated)
    }

    async updateRole(id: number, name: string): Promise<RoleResponse | undefined> {
        await this.validateRoleRegister(name, id)

        const role = await this._roleRepository.get(id)
        if (!role) 
            RoleError.notFound()
        
        role!.update(name)
        const roleUpdated = await this._roleRepository.update(role!)
        if (!roleUpdated)
            throw new RoleError('Fail to recover the role updated.')
        
        return mapToRoleResponse(roleUpdated)
    }
    
    async removeRole(id: number): Promise<void> {
        const role = await this._roleRepository.get(id)
        if (!role) 
            RoleError.notFound()
        
        const removed = await this._roleRepository.delete(role!)
        if (!removed)
            throw new RoleError("Cannot remove the role.")
    }
    
    async searchRole(id: number): Promise<RoleResponse | undefined> {
        const role = await this._roleRepository.get(id)
        if (!role)
            return undefined
        
        return mapToRoleResponse(role)
    }
    
    async searchRoles(filter: FilterRequest): Promise<RoleResponse[]> {
        const query = mapToQuery(filter)
        const roles = await this._roleRepository.getMany(query.query)
        return roles.map(role => mapToRoleResponse(role))
    }

    private async validateRoleRegister(name: string, idToIgnore?: number): Promise<void> {
        const roleFound = await this._roleRepository.getByName(name, idToIgnore)
        if (roleFound)
            RoleError.alreadyExists()
    }
}