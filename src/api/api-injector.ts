import RuleRepository from "../infra/rules-infra.js"

type RepositoryType = 'rule'

const repositoryMap = {
    'rule': RuleRepository
}

function getRepository(type: RepositoryType): any {
    const RepoClass = repositoryMap[type]
    return new RepoClass()
}

export { getRepository }