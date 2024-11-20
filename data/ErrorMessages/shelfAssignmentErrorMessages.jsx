const shelfAssignmentErrorMessages = {
    invalidMaxQuant: "Entered value for max quantity is not a number",
    negativeOrExcessiveMaxQuant: "Entered value is either less than zero or exceeds max possible value",
    invalidCurrentQuant: "Entered value for current quantity is not a number",
    currentQuantBelowZeroOrAboveMaxQuant: "Current Quantity is either less than zero or exceeds max quantity value",
    currentQuantToMaxQuantMismatch: "Current quantity exceeds max quantity",
    currentQuantBelowZeroOrAbovePiecesLeft: "Entered current quantity value is either less than zero or exceeds number of pieces for assignment",
    invalidMaxQuantPositiveError: "Please enter a positive number greater than 0",
    invalidMaxQuantValid: "Please enter a valid max quantity number",
    currentQuantBelowZeroOrAboveProductQuant: "Entered value is either less than zero or exceeds product's quantity",
    currentQuantValidQuantNumber: "Please enter a valid current quantity number",
    currentQuantAbovePiecesToDistribution: "Entered values exceeds number of pieces for distribution",
    currentQuantNotEnoughSpace: "There is not enough space on the shelf",
    currentQuantValidNumber: "Please input valid number"
}

export default shelfAssignmentErrorMessages;