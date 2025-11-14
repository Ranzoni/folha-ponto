import type { EmployeeResponse } from "../../api/models/employee.response.js"
import type Employee from "../../domain/models/employee.model.js"
import mapToDepartmentResponse from "./department.mapper.js"
import mapToRoleResponse from "./role.mapper.js"
import { mapToWorkScheduleResponse } from "./work-schedule.mapper.js"

export default function mapToEmployeeResponse(employee: Employee): EmployeeResponse {
    return {
        id: employee.id,
        name: employee.name,
        workSchedule: mapToWorkScheduleResponse(employee.workSchedule),
        department: mapToDepartmentResponse(employee.department),
        role: mapToRoleResponse(employee.role)
    } as EmployeeResponse
}