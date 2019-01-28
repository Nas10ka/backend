const name = 't1';
const timer = setTimeout.bind(global, function() {
  console.log(1);
}, 1000); 
console.log(111, global)
console.log(timer);
console.log(222, global);
timer.call();

