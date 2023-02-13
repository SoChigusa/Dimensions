const str2float = input => {
  let inputIsNaN = false;
  let value = 1;
  const elements = input.split('/');
  if (elements.length == 1) { // example: 1, 1.2, 1e10
    if (isNaN(elements[0])) {
      inputIsNaN = true;
    } else {
      value = parseFloat(input);
    }
  } else if (elements.length == 2) { // example: 1/3
    if (isNaN(elements[0]) || isNaN(elements[1])) {
      inputIsNaN = true;
    } else {
      value = parseFloat(elements[0]) / parseFloat(elements[1]);
    }
  } else {
    inputIsNaN = true;
  }
  return { inputIsNaN, value };
};

export default str2float;