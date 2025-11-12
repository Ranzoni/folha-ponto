import type DepartmentResponse from "../../api/models/department.response.js"
import type Department from "../../domain/models/department.model.js"

export default function mapToDepartmentResponse(rule: Department): DepartmentResponse {
    return {
        id: rule.id,
        name: rule.name
    } as DepartmentResponse 
}