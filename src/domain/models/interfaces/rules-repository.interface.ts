import type Rule from "../rule.model.js"
import type IRepositoryRead from "./repository-read.interface.js"
import type IRepository from "./repository.interface.js"

export default interface IRuleRepository extends IRepository<Rule>, IRepositoryRead<Rule> {
    getByName(name: string, idToIgnore?: number): Promise<Rule | undefined>
}