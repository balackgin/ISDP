export function getApiQuery(args = {}) {
  let str = '';
  // for (let i in args) {
  //   str += str ? `&${ i }=${ args[i] }` : `?${ i }=${ args[i] }`;
  // }
  Object.keys(args).forEach((item) => {
    let total = `${ item }=${
      [ 'array', 'object' ].includes(typeof args[item])
        ? JSON.stringify(args[item])
        : args[item]
    }`;
    str += str ? `&${ total }` : `?${ total }`;
  });
  return str;
}