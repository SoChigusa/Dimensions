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
      value *= (p * u) ** unit.power;
      dimension += units[unit_info.unit_id].dimension * unit.power;
    }
  });
  return { value, dimension, new_alerts };
}

const calculate = ({ units, prefixes, all_units, alerts, setAlerts, }) => {
  const output = { display: true, name: 'B_a', power: -1, value: 1, units: [{ name: 'T', power: '1' }] };
  const parameters = [
    { display: false, name: '2', power: 0.5, value: '2', units: [] },
    { display: false, name: 'e', power: -1, value: '1', units: [{ name: 'e', power: '1' }] },
    { display: false, name: 'v_a', power: 1, value: '1e-3', units: [{ name: 'const', power: '1' }] },
    { display: true, name: 'g_{aee}', power: '1', value: '1e-10', units: [{ name: 'const', power: '1' }] },
    { display: true, name: '\\rho_a', power: 0.5, value: '0.3', units: [{ name: 'GeV', power: '1' }, { name: 'cm', power: '-3' }] },
  ];
  const elements = parameters.concat(output);
  let value = 1.;
  let dimension = 0;
  elements.map(element => {
    const ineV = uniteV({ units, prefixes, all_units, input: element.units, alerts, setAlerts });
    value *= (element.value * ineV.value) ** element.power;
    dimension += ineV.dimension * element.power;
  });
  if (dimension != 0) {
    setAlerts([...alerts,
      'Output mass dimension does not match the sum of input dimensions!'
    ]);
  }
  return { value, dimension };
}

export default calculate;