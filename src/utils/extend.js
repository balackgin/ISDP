Object.defineProperties(Date.prototype, {
  format: {
    set() {
      console.warn('set error!');
    },
    get() {
      return function(format = 'yyyy-MM-dd') {
        let date = this;
        if (date.toString() === 'Invalid Date' || typeof format !== 'string') {
          console.warn(date, format, 'error');
          return false;
        }
        let year = date.getFullYear(),
          month = date.getMonth() + 1,
          day = date.getDate();

        return format
          .replace(/y+/, year)
          .replace(/M+/, month < 10 ? '0' + month : month)
          .replace(/d+/, day < 10 ? '0' + day : day);
      };
    }
  }
});

Object.defineProperties(Object.prototype, {
  json: {
    get() {
      return function(args) {
        if (typeof args === 'string') {
          return JSON.parse(args);
        }
        return JSON.parse(JSON.stringify(args || this));
      };
    }
  },
  toJson: {
    get() {
      return function(args) {
        if (typeof args === 'string') {
          return JSON.parse(args);
        }
        return JSON.parse(JSON.stringify(args || this));
      };
    }
  },
  objEqual: {
    get() {
      return function(firstObj, secondObj) {
        if (!firstObj || typeof firstObj !== 'object') {
          return false;
        }
        let matchObj = secondObj || this,
          firstObject = Object.keys(firstObj);
        return (
          firstObject.length === Object.keys(matchObj).length &&
          !firstObject.some((item) => firstObj[item] !== matchObj[item])
        );
      };
    }
  },
  isCongruence: {
    get() {
      return function(firstObj, secondObj) {
        if (!firstObj || typeof firstObj !== 'object') {
          return false;
        }
        let matchObj = secondObj || this,
          firstObject = Object.keys(firstObj);
        return (
          firstObject.length === Object.keys(matchObj).length &&
          !firstObject.some((item) => firstObj[item] !== matchObj[item])
        );
      };
    }
  },
  isNull: {
    get() {
      return function(args) {
        if (args && typeof args !== 'object') {
          console.warn('isNull error');
          return false;
        }
        const obj = args || this;
        return !Object.keys(obj).length;
      };
    }
  }
});

// function getProxyObj(args) {
//   return new Proxy(args, {
//     set() {
//       return false;
//     },
//     construct() {
//       return false;
//     },
//     deleteProperty() {
//       return false;
//     }
//   });
// }

// window.common = getProxyObj({
//   download: getProxyObj(function(args, fileName) {
//     if (navigator.msSaveOrOpenBlob) {
//       //IE
//       navigator.msSaveOrOpenBlob(args, fileName);
//     } else {
//       let url = URL.createObjectURL(args);
//       let link = document.createElement('a');
//       link.href = url;
//       // link.target = '_blank';
//       link.download = fileName;
//       document.body.appendChild(link);
//       link.click();
//       URL.revokeObjectURL(url);
//       document.body.removeChild(link);
//     }
//   })
// });
