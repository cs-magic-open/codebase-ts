import { isNumeric } from "./is-numeric"

export function evalObject(input?: string): unknown {
  // Attempt to convert the input string to a number
  if (isNumeric(input)) {
    return Number(input) // Return the number if conversion was successful
  }

  // Convert 'true' or 'false' strings to boolean values
  if (input?.toLowerCase() === "true") {
    return true
  }
  if (input?.toLowerCase() === "false") {
    return false
  }

  // Return the original string if it's neither a number nor a boolean
  return input
}
