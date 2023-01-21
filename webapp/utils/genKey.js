const genKey = ({ asList = true, size = 1 } = {}) => {
  if (!asList) {
    return Math.random().toString(32).substring(2);
  } else {
    let res = [];
    for (let i = 0; i < size; i++) {
      res.push(Math.random().toString(32).substring(2));
    }
    return res;
  }
}

export default genKey;