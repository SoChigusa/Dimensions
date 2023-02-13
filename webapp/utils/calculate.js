import { genLatexSrc } from "./genLatexSrc";
import str2float from "./str2float";

const consteV = ({ extractConstantInfo, input, addAlerts }) => {
  let value = 1;
  const constantInfo = extractConstantInfo(input);
  if (constantInfo.isAbsent) {
    addAlerts({
      severity: 'error',
      content: 'Constant "' + input + '" is not a number and does not match any constant in the database!'
    });
  } else {
    value = constantInfo.value;
  }
  return { value, dimension: 0 };
}

const uniteV = ({ extractUnitInfo, input, addAlerts }) => {
  let value = 1.;
  let dimension = 0;
  input.map(unit => {
    const unitInfo = extractUnitInfo(unit);
    const powerInfo = str2float(unit.power);
    if (!unitInfo.isAbsent && !powerInfo.inputIsNaN) {
      value *= (unitInfo.prefix.value * unitInfo.unit.value) ** powerInfo.value;
      dimension += unitInfo.unit.dimension * powerInfo.value;
    } else {
      if (unitInfo.isAbsent) {
        addAlerts({
          severity: 'error',
          content: 'Unit name "' + unit.name + '" does not match any unit in the database!'
        });
      }
      if (powerInfo.inputIsNaN) {
        addAlerts({
          severity: 'error',
          content: 'Unit power "' + unit.power + '" is not a number!'
        });
      }
    }
  });
  return { value, dimension };
}

const calculate = ({ extractConstantInfo, extractUnitInfo, output, input, options, setResult, setAlerts, livePreview }) => {
  let value = 1.;
  let outputDimension, dimension = 0;
  let newAlerts = [];
  const parameters = [output, ...input]
  const addAlerts = a => { newAlerts.push(a); }
  parameters.map((parameter, index) => {
    const ineV = parameter.units.length == 0 ?
      consteV({ extractConstantInfo, input: parameter.name, addAlerts }) : // constant
      uniteV({ extractUnitInfo, input: parameter.units, addAlerts }); // parameter
    const valueInfo = str2float(parameter.value);
    const powerInfo = str2float(parameter.power);
    if (!valueInfo.inputIsNaN && !powerInfo.inputIsNaN) {
      const power = index == 0 ? -powerInfo.value : powerInfo.value; // only difference btw output & input
      value *= (valueInfo.value * ineV.value) ** power;
      dimension += ineV.dimension * power;
      if (index == 0) outputDimension = -dimension;
    } else {
      if (valueInfo.inputIsNaN) {
        addAlerts({
          severity: 'error',
          content: 'Parameter value "' + parameter.value + '" is not a number!'
        });
      }
      if (powerInfo.inputIsNaN) {
        addAlerts({
          severity: 'error',
          content: 'Parameter power "' + parameter.power + '" is not a number!'
        });
      }
    }
  });

  // dimension check upto the maximum precision (5 digits)
  dimension = dimension.toFixed(4);
  if (dimension != 0) {
    if (livePreview) {
      addAlerts({
        severity: 'warning',
        content: `Output mass dimension = ${outputDimension}, input mass dimension = ${dimension + outputDimension}`,
      });
    } else {
      addAlerts({
        severity: 'error',
        content: `Output mass dimension = ${outputDimension} does not match the sum of input mass dimensions = ${dimension + outputDimension}!`,
      });
    }
  }

  setAlerts(newAlerts);
  if (newAlerts.length == 0) {
    const digits = options.digits;
    setResult({
      value: value,
      latex: genLatexSrc({ extractUnitInfo, output, input, digits, value })
    });
  }
}

export default calculate;