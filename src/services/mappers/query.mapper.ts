import type { FilterRequest } from "../../api/models/filter.request.js";
import Filter from "../../domain/shared/filter.js"

export function mapToQuery(filter: FilterRequest): Filter {
    const query = new Filter(filter.page, filter.quantity)
    
    filter.conditions?.forEach(condition => {
        query.addFilter(condition.field, condition.operator, condition.value)
    });

    if (filter.order)
        query.addOrder(filter.order.field, filter.order.orderType)

    return query
}