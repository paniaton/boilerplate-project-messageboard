const timeOutPromise = (str) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(str);
    }, 200)
  })
}
(async () => {
  try {
    let val;
    val = await timeOutPromise('foo');
    console.log(val);
    val = await timeOutPromise('bar');
    console.log(val);
    val = await timeOutPromise('baz');
    console.log(val);
  } catch (err) {
    console.error(err);
  }
})();