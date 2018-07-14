export { errorMsg }

function errorMsg (errorObj, itemCaption) {
  if (errorObj.sameAsPassword !== undefined && !errorObj.sameAsPassword) {
    return `${itemCaption} must be identical.`
  }
  if (errorObj.minLength !== undefined && !errorObj.minLength) {
    return `${itemCaption} must have at least ${errorObj.$params.minLength.min} letters.`
  }
  if (errorObj.email !== undefined && !errorObj.email) {
    return `${itemCaption}の形式が不正です。`
  }
  if (errorObj.required !== undefined && !errorObj.required) {
    return `${itemCaption} is required.`
  }
}
