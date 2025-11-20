import Employee from "../../domain/models/employee.model.js"
import { WorkSchedule, WorkScheduleItem } from "../../domain/shared/work-schedule.model.js"
import mapAnyToDepartment from "./department.mapper.js"
import mapAnyToRole from "./role.mapper.js"

export default function mapAnyToEmployee(data: any): Employee {
    const firstPeriod = new WorkScheduleItem(data.firstPeriodStart, data.firstPeriodEnd)
        
    let lunch: WorkScheduleItem | undefined = undefined
    if (data.lunchPeriodStart && data.lunchPeriodEnd)
        lunch = new WorkScheduleItem(data.lunchPeriodStart, data.lunchPeriodEnd)

    let secondPeriod: WorkScheduleItem | undefined = undefined
    if (data.secondPeriodStart && data.secondPeriodEnd)
        secondPeriod = new WorkScheduleItem(data.secondPeriodStart, data.secondPeriodEnd)

    const workSchedule = new WorkSchedule(firstPeriod, lunch, secondPeriod)

    const department = mapAnyToDepartment(data.department)
    const role = mapAnyToRole(data.role)

    return new Employee(
        data.name,
        workSchedule,
        department,
        role,
        data.id,
        data.createdAt,
        data.updatedAt
    )
}