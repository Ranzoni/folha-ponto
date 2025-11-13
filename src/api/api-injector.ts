import { openTransaction, type TransactionCallBack } from "../infra/context-infra.js"
import DepartmentRepository from "../infra/departments-infra.js"
import RuleRepository from "../infra/roles-infra.js"
import DepartmentService from "../services/department-service.js"
import RoleService from "../services/role-service.js"
import InjectorError from "./errors/injector.error.js"

type ServicesType = 'role' | 'department'

type ServiceMap = {
    'role': RoleService
    'department': DepartmentService
}

function getService<T extends ServicesType>(type: ServicesType): ServiceMap[T] {
    switch (type) {
        case 'role':
            const ruleRepo = getRepository('role')
            if (!ruleRepo)
                InjectorError.ruleRepoNotFound()

            return new RoleService(ruleRepo) as ServiceMap[T]
        case 'department':
            const departmentRepo = getRepository('department')
            if (!departmentRepo)
                InjectorError.departmentRepoNotFound()

            return new DepartmentService(departmentRepo) as ServiceMap[T]
        default:
            throw InjectorError.serviceNotFound()
    }
}

type RepositoryMap = {
    'role': RuleRepository
    'department': DepartmentRepository
}

function getRepository<T extends ServicesType>(type: T): RepositoryMap[T] {
    switch (type) {
        case 'role':
            return new RuleRepository() as RepositoryMap[T]
        case 'department':
            return new DepartmentRepository() as RepositoryMap[T]
        default:
            throw InjectorError.serviceNotFound()
    }
}

async function transaction<TResponse>(callBack: TransactionCallBack<TResponse | undefined>): Promise<TResponse | undefined> {
    return await openTransaction(callBack)
}

export { getService, getRepository, transaction }