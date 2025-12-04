import type DepartmentResponse from "../../api/models/departments/department.response.js"
import type Department from "../../domain/models/department.model.js"

export default function mapToDepartmentResponse(department: Department): DepartmentResponse {
    return {
        id: department.id,
        name: department.name
    } as DepartmentResponse 
}