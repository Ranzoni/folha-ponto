function departmentNameIsValid(name: string): boolean {
    return !!name.trim() && name.trim().length >= 2 && name.trim().length <= 100
}

export { departmentNameIsValid }