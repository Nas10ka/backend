const func = () => console.log(1);

const timerId = setTimeout(func, 2000);

clearTimeout(timerId);