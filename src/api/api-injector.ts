import type IRuleRepository from "../domain/models/interfaces/rules-repository.interface.js"
import { openTransaction, type TransactionCallBack } from "../infra/context-infra.js"
import RuleRepository from "../infra/rules-infra.js"
import RuleService from "../services/rule-service.js"
import InjectorError from "./errors/injector.error.js"

type ServicesType = 'rule'

type ServiceMap = {
    'rule': RuleService
}

type RepositoryMap = {
    'rule': IRuleRepository
}

function getService<T extends ServicesType>(type: ServicesType): ServiceMap[T] {
    let service: any
    switch (type) {
        case 'rule':
            const repo = getRepository('rule')
            if (!repo)
                InjectorError.ruleRepoNotFound()

            service = new RuleService(repo)
            break
        default:
            InjectorError.serviceNotFound()
    }

    return service
}

const repositoryMap = {
    'rule': RuleRepository
} as const

function getRepository<T extends ServicesType>(type: T): RepositoryMap[T] {
    const RepoClass = repositoryMap[type]
    return new RepoClass() as RepositoryMap[T]
}

async function transaction<TResponse>(callBack: TransactionCallBack<TResponse | undefined>): Promise<TResponse | undefined> {
    return await openTransaction(callBack)
}

export { getService, getRepository, transaction }