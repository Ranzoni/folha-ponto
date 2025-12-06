enum PermissionEntity {
    DEPARTMENT,
    ROLE,
    EMPLOYEE,
    WORK_SCHEDULE,
    EMPLOYEE_GROUP
}

function isPermissionEntity(value: number): boolean {
  return Object.values(PermissionEntity).includes(value)
}

export { PermissionEntity, isPermissionEntity }