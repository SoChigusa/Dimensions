import genLatexSrc from "./genLatexSrc";

const uniteV = ({ units, prefixes, all_units, input, alerts, setAlerts }) => {
  let value = 1.;
  let dimension = 0;
  let new_alerts = alerts;
  input.map(unit => {
    const unit_info = all_units.find((elem) => {
      return elem.name == unit.name;
    });
    if (typeof unit_info === "undefined") {
      setAlerts([...alerts,
      'Unit name "' + unit.name + '" does not match any unit in the database!'
      ]);
    } else {
      const p = prefixes[unit_info.prefix_id].value;
      const u = units[unit_info.unit_id].value;
      value *= (p * u) ** eval(unit.power);
      dimension += units[unit_info.unit_id].dimension * eval(unit.power);
    }
  });
  return { value, dimension, new_alerts };
}

const calculate = ({ units, prefixes, all_units, output, parameters, setLatex, alerts, setAlerts, }) => {
  let value = 1.;
  let dimension = 0;
  parameters.map((parameter, index) => {
    const ineV = uniteV({ units, prefixes, all_units, input: parameter.units, alerts, setAlerts });
    const power = index == 0 ? -eval(parameter.power) : eval(parameter.power);
    value *= (eval(parameter.value) * ineV.value) ** power;
    dimension += ineV.dimension * power;
  });

  if (dimension != 0) {
    setAlerts([...alerts,
      'Output mass dimension does not match the sum of input dimensions!'
    ]);
  } else {
    setLatex(genLatexSrc({ parameters, value }));
  }
}

export default calculate;