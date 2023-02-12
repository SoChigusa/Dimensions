import { genLatexSrc } from "./genLatexSrc";

const consteV = ({ extractConstantInfo, input, addAlerts }) => {
  let value = 1;
  const constantInfo = extractConstantInfo(input);
  if (constantInfo.isAbsent) {
    addAlerts({
      severity: 'error',
      content: 'Constant name "' + input + '" does not match any constant in the database!'
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
    if (unitInfo.isAbsent) {
      addAlerts({
        severity: 'error',
        content: 'Unit name "' + unit.name + '" does not match any unit in the database!'
      });
    } else {
      value *= (unitInfo.prefix.value * unitInfo.unit.value) ** eval(unit.power);
      dimension += unitInfo.unit.dimension * eval(unit.power);
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
    const power = index == 0 ? -eval(parameter.power) : eval(parameter.power); // only difference btw output & input
    value *= (eval(parameter.value) * ineV.value) ** power;
    dimension += ineV.dimension * power;
    if (index == 0) outputDimension = -dimension;
  });

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
  if (dimension == 0 && newAlerts.length == 0) {
    const digits = options.digits;
    setResult({
      value: value,
      latex: genLatexSrc({ extractUnitInfo, output, input, digits, value })
    });
  }
}

export default calculate;