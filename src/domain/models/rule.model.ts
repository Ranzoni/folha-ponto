import RuleError from "../errors/rule.error.js"
import { ruleNameIsValid } from "../validators/rule.validator.js"
import { BaseModel } from "./base.model.js"

export default class Rule extends BaseModel {
    private _name: string
    
    constructor(name: string, id?: number, createdAt?: Date, updatedAt?: Date) {
        super(id, createdAt, updatedAt)
        
        this._name = name

        this.validate()
    }
    
    name(): string {
        return this._name
    }
    
    protected validate(): void {
        const ruleName = this.name()

        if (!ruleNameIsValid(ruleName))
            RuleError.invalidName()
    }
}