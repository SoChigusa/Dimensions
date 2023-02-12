export const val2exp = ({ value, digits }) => {
  const exp = Math.floor(Math.log10(value));
  const vf = (value / Math.pow(10, exp)).toFixed(digits - 1);
  let str;
  if (vf == 1) {
    if (exp == 0) str = '1 ';
    else if (exp == 1) str = '10 ';
    else str = `10^{${exp}} `;
  } else {
    str = `${vf} `;
    if (exp == 1) str += `\\times 10 `;
    else if (exp != 0) str += `\\times 10^{${exp}} `;
  }
  return str;
}

const unit2exp = ({ units, prefixes, all_units, unit }) => {
  const unit_info = all_units.find((elem) => {
    return elem.name == unit.name;
  });
  const prefix = prefixes[unit_info.prefix_id];
  const unitBody = units[unit_info.unit_id];
  const prefixLatex = 'latex' in prefix ? prefix.latex : prefix.name;
  const unitBodyLatex = 'latex' in unitBody ? unitBody.latex : unitBody.name;

  let str = unit.name == 'const' ? '' : '\\,';
  let power = eval(unit.power);
  if (power < 0) {
    str += '/\\, ';
    power *= -1;
  }
  str += `\\mathrm{${prefixLatex} ${unitBodyLatex}}${power2exp(power)}`;
  return str;
}

const power2exp = power => {
  if (power == 1) return ' ';
  else return `^{${power}} `;
}

export const genLatexSrc = ({ units, prefixes, all_units, output, input, digits, value }) => {
  let latex = `\$\$${output.name} \\sim ${val2exp({ value, digits })}`;
  output.units.map(unit => {
    latex += unit2exp({ units, prefixes, all_units, unit });
  });
  input.map((parameter, index) => { // input parameters
    if (parameter.display) {
      let power = eval(parameter.power);
      if (power > 0) {
        latex += `\\left(\\frac{${parameter.name}}{${val2exp({ value: parameter.value, digits })}`;
        parameter.units.map(unit => {
          latex += unit2exp({ units, prefixes, all_units, unit });
        });
      } else {
        power *= -1;
        latex += `\\left(\\frac{${val2exp({ value: parameter.value, digits })}`;
        parameter.units.map(unit => {
          latex += unit2exp({ units, prefixes, all_units, unit });
        });
        latex += `}{${parameter.name}`;
      }
      latex += `}\\right)${power2exp(power)}`;
    }
  });
  latex += '\$\$';
  return latex;
};