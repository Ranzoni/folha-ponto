import { openTransaction, type TransactionCallBack } from "../infra/context-infra.js"
import DepartmentRepository from "../infra/departments-infra.js"
import RuleRepository from "../infra/rules-infra.js"
import DepartmentService from "../services/department-service.js"
import RuleService from "../services/rule-service.js"
import InjectorError from "./errors/injector.error.js"

type ServicesType = 'rule' | 'department'

type ServiceMap = {
    'rule': RuleService
    'department': DepartmentService
}

function getService<T extends ServicesType>(type: ServicesType): ServiceMap[T] {
    switch (type) {
        case 'rule':
            const ruleRepo = getRepository('rule')
            if (!ruleRepo)
                InjectorError.ruleRepoNotFound()

            return new RuleService(ruleRepo) as ServiceMap[T]
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
    'rule': RuleRepository
    'department': DepartmentRepository
}

function getRepository<T extends ServicesType>(type: T): RepositoryMap[T] {
    switch (type) {
        case 'rule':
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