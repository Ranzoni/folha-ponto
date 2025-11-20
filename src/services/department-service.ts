import type DepartmentResponse from "../api/models/department.response.js"
import type { FilterRequest } from "../api/models/filter.request.js"
import DepartmentError from "../domain/errors/department.error.js"
import Department from "../domain/models/department.model.js"
import type IDepartmentRepository from "../domain/repositories/departments-repository.interface.js"
import mapToDepartmentResponse from "./mappers/department.mapper.js"
import { mapToQuery } from "./mappers/query.mapper.js"

export default class DepartmentService {
    private _departmentRepository: IDepartmentRepository
    
    constructor(departmentRepository: IDepartmentRepository) {
        this._departmentRepository = departmentRepository
    }

    async createDepartment(name: string): Promise<DepartmentResponse | undefined> {
        await this.validateDepartmentRegister(name)

        const department = new Department(name)
        const departmentCreated = await this._departmentRepository.save(department)
        if (!departmentCreated)
            throw new DepartmentError('Falha ao recuperar o departamento criado.')

        return mapToDepartmentResponse(departmentCreated)
    }

    async updateDepartment(id: number, name: string): Promise<DepartmentResponse | undefined> {
        await this.validateDepartmentRegister(name, id)

        const department = await this._departmentRepository.get(id)
        if (!department)
            DepartmentError.notFound()

        department!.update(name)
        const departmentUpdated = await this._departmentRepository.update(department!)
        if (!departmentUpdated)
            throw new DepartmentError('Falha ao recuperar o departamento alterado.')

        return mapToDepartmentResponse(departmentUpdated!)
    }

    async removeDepartment(id: number): Promise<void> {
        const department = await this._departmentRepository.get(id)
        if (!department) 
            DepartmentError.notFound()
        
        const removed = await this._departmentRepository.delete(department!)
        if (!removed)
            throw new DepartmentError("Falha ao remover o departamento.")
    }
    
    async searchDepartment(id: number): Promise<DepartmentResponse | undefined> {
        const department = await this._departmentRepository.get(id)
        if (!department)
            return undefined
        
        return mapToDepartmentResponse(department)
    }
    
    async searchDepartments(filter: FilterRequest): Promise<DepartmentResponse[]> {
        const query = mapToQuery(filter)
        const departments = await this._departmentRepository.getMany(query.query)
        return departments.map(department => mapToDepartmentResponse(department))
    }

    private async validateDepartmentRegister(name: string, idToIgnore?: number): Promise<void> {
        const departmentFound = await this._departmentRepository.getByName(name, idToIgnore)
        if (departmentFound)
            DepartmentError.alreadyExists()
    }
}