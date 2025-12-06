enum PermissionType {
    CREATE,
    UPDATE,
    DELETE,
    VIEW
}

function isPermissionType(value: number): boolean {
  return Object.values(PermissionType).includes(value)
}

export { PermissionType, isPermissionType }