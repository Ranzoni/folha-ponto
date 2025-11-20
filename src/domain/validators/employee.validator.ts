function employeeNameIsValid(name: string): boolean {
    return !!name.trim() && name.trim().length >= 3 && name.length <= 100
}

export { employeeNameIsValid }