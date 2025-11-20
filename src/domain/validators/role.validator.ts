function roleNameIsValid(name: string): boolean {
    return !!name.trim() && name.trim().length >= 3 && name.length <= 50
}

export { roleNameIsValid }