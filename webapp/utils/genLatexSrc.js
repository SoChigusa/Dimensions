import roundToPrecision from "./roundToPrecision";
import str2float from "./str2float";

export const val2exp = ({ valStr, options, isOutput = false } = {}) => {
  let str;
  const value = str2float(valStr).value;
  if (options.stringInput && !isOutput && Math.abs(value) >= 0.01 && Math.abs(value) < 100) {
    str = valStr;
  } else {
    let rounded = roundToPrecision(value, options.digits);
    const exp = Math.floor(Math.log10(rounded));
    const vf = roundToPrecision(rounded / Math.pow(10, exp), options.digits);
    if (vf == 1) {
      if (exp == 0) str = '1 ';
      else if (exp == 1) str = '10 ';
      else str = `10^{${exp}} `;
    } else {
      str = `${vf} `;
      if (exp == 1) str += `\\times 10 `;
      else if (exp != 0) str += `\\times 10^{${exp}} `;
    }
  }
  return str;
}

const unit2exp = ({ extractUnitInfo, unit, options }) => {
  const unitInfo = extractUnitInfo(unit);
  const prefixLatex = 'latex' in unitInfo.prefix ? unitInfo.prefix.latex : unitInfo.prefix.name;
  const unitBodyLatex = 'latex' in unitInfo.unit ? unitInfo.unit.latex : unitInfo.unit.name;
  let str = unit.name == 'const' ? '' : '\\,';
  let power = unit.power;
  if (str2float(power).value < 0) {
    str += '/\\, ';
    power = power.replace('-', '');
  }
  str += `\\mathrm{${prefixLatex} ${unitBodyLatex}}${power2exp({ powStr: power, options })}`;
  return str;
}

const power2exp = ({ powStr, options }) => {
  const power = roundToPrecision(str2float(powStr).value, options.digits);
  if (power == 1) return ' ';
  else {
    if (options.stringInput) {
      return `^{${powStr}} `;
    } else {
      return `^{${power}} `;
    }
  }
}

export const genLatexSrc = ({ extractUnitInfo, output, input, options, result }) => {
  const resStr = val2exp({ valStr: result.toString(10), options, isOutput: true });
  let latex = `\$\$${output.name} \\sim ${resStr}`;
  output.units.map(unit => {
    latex += unit2exp({ extractUnitInfo, unit, options });
  });
  input.map((parameter, index) => { // input parameters
    if (parameter.display) {
      let value = parameter.value;
      let power = parameter.power;
      if (str2float(power).value > 0) {
        latex += `\\left(\\frac{${parameter.name}}{${val2exp({ valStr: value, options })}`;
        parameter.units.map(unit => {
          latex += unit2exp({ extractUnitInfo, unit, options });
        });
      } else {
        power = power.replace('-', '');
        latex += `\\left(\\frac{${val2exp({ valStr: value, options })}`;
        parameter.units.map(unit => {
          latex += unit2exp({ extractUnitInfo, unit, options });
        });
        latex += `}{${parameter.name}`;
      }
      latex += `}\\right)${power2exp({ powStr: power, options })}`;
    }
  });
  latex += '\$\$';
  return latex;
};