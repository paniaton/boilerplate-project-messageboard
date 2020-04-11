const timeOutPromise = (str) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(str);
      }, 200)
    })
  }
  timeOutPromise('foo')
    .then((val) => {
      console.log(val);
      return timeOutPromise('bar');
    })
    .then((val) => {
      console.log(val);
      return timeOutPromise('baz');
    })
    .then((val) => {
      console.log(val);
    })
