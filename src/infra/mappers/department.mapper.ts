import Department from "../../domain/models/department.model.js"

export default function mapAnyToDepartment(data: any): Department {
    return new Department(
        data.name,
        data.id,
        data.createdAt,
        data.updatedAt
    )
}