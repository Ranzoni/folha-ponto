function ruleNameIsValid(name: string): boolean {
    return !!name.trim() && name.trim().length >= 3 && name.trim().length <= 50
}

export { ruleNameIsValid }