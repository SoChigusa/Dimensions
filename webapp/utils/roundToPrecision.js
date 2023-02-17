const roundToPrecision = (value, digits = 1) => {
  const strVal = value.toPrecision(digits);
  return parseFloat(strVal);
}

export default roundToPrecision;