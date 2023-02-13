import str2float from "./str2float";

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

const unit2exp = ({ extractUnitInfo, unit, digits }) => {
  const unitInfo = extractUnitInfo(unit);
  const prefixLatex = 'latex' in unitInfo.prefix ? unitInfo.prefix.latex : unitInfo.prefix.name;
  const unitBodyLatex = 'latex' in unitInfo.unit ? unitInfo.unit.latex : unitInfo.unit.name;
  let str = unit.name == 'const' ? '' : '\\,';
  let power = str2float(unit.power).value.toFixed(digits - 1);
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

export const genLatexSrc = ({ extractUnitInfo, output, input, digits, value }) => {
  let latex = `\$\$${output.name} \\sim ${val2exp({ value, digits })}`;
  output.units.map(unit => {
    latex += unit2exp({ extractUnitInfo, unit, digits });
  });
  input.map((parameter, index) => { // input parameters
    if (parameter.display) {
      let value = str2float(parameter.value).value.toFixed(digits - 1);
      let power = str2float(parameter.power).value.toFixed(digits - 1);
      if (power > 0) {
        latex += `\\left(\\frac{${parameter.name}}{${val2exp({ value, digits })}`;
        parameter.units.map(unit => {
          latex += unit2exp({ extractUnitInfo, unit, digits });
        });
      } else {
        power *= -1;
        latex += `\\left(\\frac{${val2exp({ value, digits })}`;
        parameter.units.map(unit => {
          latex += unit2exp({ extractUnitInfo, unit, digits });
        });
        latex += `}{${parameter.name}`;
      }
      latex += `}\\right)${power2exp(power)}`;
    }
  });
  latex += '\$\$';
  return latex;
};