const genKey = ({ size = 1 } = {}) => {
  if (size == 1) {
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