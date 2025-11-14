import Role from "../../domain/models/role.model.js"

export default function mapAnyToRole(data: any): Role {
    return new Role(
        data.name,
        data.id,
        data.createdAt,
        data.updatedAt
    )
}