import genLatexSrc from "./genLatexSrc";

const consteV = ({ constants, input, addAlerts }) => {
  let value = 1;
  const constant = constants.find(c => {
    return c.name == input
  });
  if (typeof constant === "undefined") {
    if (isNaN(input)) {
      addAlerts({
        severity: 'error',
        content: 'Constant name "' + input + '" does not match any constant in the database!'
      });
    } else {
      value = eval(input);
    }
  } else {
    value = constant.value;
  }
  return { value, dimension: 0 };
}

const uniteV = ({ units, prefixes, all_units, input, addAlerts }) => {
  let value = 1.;
  let dimension = 0;
  input.map(unit => {
    const unit_info = all_units.find((elem) => {
      return elem.name == unit.name;
    });
    if (typeof unit_info === "undefined") {
      addAlerts({
        severity: 'error',
        content: 'Unit name "' + unit.name + '" does not match any unit in the database!'
      });
    } else {
      const p = prefixes[unit_info.prefix_id].value;
      const u = units[unit_info.unit_id].value;
      value *= (p * u) ** eval(unit.power);
      dimension += units[unit_info.unit_id].dimension * eval(unit.power);
    }
  });
  return { value, dimension };
}

const calculate = ({ units, prefixes, all_units, constants, output, input, options, setResult, setAlerts, livePreview }) => {
  let value = 1.;
  let outputDimension, dimension = 0;
  let newAlerts = [];
  const parameters = [output, ...input]
  const addAlerts = a => { newAlerts.push(a); }
  parameters.map((parameter, index) => {
    const ineV = parameter.units.length == 0 ?
      consteV({ constants, input: parameter.name, addAlerts }) : // constant
      uniteV({ units, prefixes, all_units, input: parameter.units, addAlerts }); // parameter
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
      latex: genLatexSrc({ units, prefixes, all_units, output, input, digits, value })
    });
  }
}

export default calculate;