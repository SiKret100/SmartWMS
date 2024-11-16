const shelfAssignmentErrorMessages = {
    invalidMaxQuant: "Entered value for max quantity is not a number",
    negativeOrExcessiveMaxQuant: "Entered value is either less than zero or exceeds max possible value",
    invalidCurrentQuant: "Entered value for current quantity is not a number",
    currentQuantBelowZeroOrAboveMaxQuant: "Current Quantity is either less than zero or exceeds max quantity value",
    currentQuantToMaxQuantMismatch: "Current quantity exceeds max quantity",
    currentQuantBelowZeroOrAbovePiecesLeft: "Entered current quantity value is either less than zero or exceeds number of pieces for assignment"
}

export default shelfAssignmentErrorMessages;