const val2exp = value => {
  const exp = Math.floor(Math.log10(value));
  const vf = Math.round(value / Math.pow(10., exp));
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

const unit2exp = unit => {
  if (unit.name == 'const') {
    return ' ';
  }

  let str = '';
  let power = eval(unit.power);
  if (power < 0) {
    str += '/ ';
    power *= -1;
  }
  str += `\\mathrm{${unit.name}}${power2exp(power)}\\,`;
  return str;
}

const power2exp = power => {
  if (power == 1) return ' ';
  else return `^{${power}} `;
}

const genLatexSrc = ({ output, input, value }) => {
  let latex = `\$\$${output.name} \\sim ${val2exp(value)}\\, `;
  output.units.map(u => {
    latex += unit2exp(u);
  });
  input.map((parameter, index) => { // input parameters
    if (parameter.display) {
      let power = eval(parameter.power);
      if (power > 0) {
        latex += `\\left(\\frac{${parameter.name}}{${val2exp(parameter.value)}\\,`;
        parameter.units.map(u => {
          latex += unit2exp(u);
        });
      } else {
        power *= -1;
        latex += `\\left(\\frac{${val2exp(parameter.value)}`;
        parameter.units.map(u => {
          latex += unit2exp(u);
        });
        latex += `}{${parameter.name}`;
      }
      latex += `}\\right)${power2exp(power)}`;
    }
  });
  latex += '\$\$';
  return latex;
};

export default genLatexSrc;