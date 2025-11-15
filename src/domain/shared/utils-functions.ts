function isNumberPrimitive(value: any): value is number {
  return typeof value === "number";
}

export { isNumberPrimitive }