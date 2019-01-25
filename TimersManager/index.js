/*
  Таймеры могут быть как одноразовыми (выполнить задачу через определённый
  промежуток времени), так и периодическими (выполнять задачу с определённым
  интервалом). Если interval = true — таймер периодический.
 */

const t1 = {
  name: 't1',
  delay: 2000,
  interval: false,
  job: () => console.log('t1')
};

const t2 = {
  name: 't2',
  delay: 1000,
  interval: false,
  job: (a, b) => console.log(a + b)
};

class TimersManager {
  constructor() {
    this.timers = [];
    console.log(this);
    this.methods = [];
    this.names = [];
  }

  // вызовы метода add можно соединять manager.add(t1).add(t2, 1, 2);

  add(timer, ...args) {
    /* Добавляет таймер в очередь на выполнение. 
      В качестве первого параметра этот метод принимает объект
      описывающий таймер, а все последующие 
      параметры передаются как аргументы для callback ф-и таймера
    */
    this.methods.push('add');
  
    try {

      if (timer.delay > 5000) throw 'Error: Delay should not exceed 5 seconds';
      if (timer.delay < 0) throw 'Error: Delay time should not be less than 0';
      if (!timer.name || typeof(timer.name) !== 'string') throw 'Error: Timer name is absent or not valid'; 
      if (this.methods.includes('start')) throw 'Error: you can\'t call the add method after the start method was called.'

      const callback = timer.interval ?
        () => setInterval(() => (timer.job(...args)), timer.delay) :
        () => setTimeout(() => (timer.job(...args)), timer.delay);
      console.log('callback', callback);

      this.timers.push({[timer.name]: callback});
      return this;
    } catch (e) {
      console.error(e);
    }


  }

  remove(name) {
    /* Должен остановить определенный таймер и удалить его из очереди
    */
    this.timers = this.timers.filter(timer => Object.keys(timer)[0] !== name);
    this.methods.push('remove');

    return this;
  }

  start() {
    // Должен запустить все таймеры на выполнениею

    this.methods.push('start');
    
    this.timers.map((timer, key) => {
      for(let key in timer) {
        timer[key]();
        return 0;
      }
    });//Object.values(timer));
    return this;
  }

  stop() {
    // Должен остановить все таймеры

    this.methods.push('stop');
    return this;
  }

  pause() {
    // Приостанавливает работу конкретного таймера

    this.methods.push('pause');
    return this;
  }

  resume() {
    // Запускает работу конкретного таймера

    this.methods.push('resume');
    return this;
  }

}

const manager = new TimersManager();


manager.add(t1).add(t2, 1, 5);
manager.add(t1);
manager.start();
// manager.add(t1).add(t2, 1, 2);
console.log(1);

// manager.add(t1).add(t2, 1, 2);
// manager.pause('t1');

manager.remove('t2');
/*
  Обратите внимание!
    1. TimeManager должен вызывать ошибку если поле name содержит неверный тип,
    отсутствует или пустая строка.
    2. TimeManager должен вызывать ошибку если поле delay содержит неверный тип или
    отсутствует.
    3. TimeManager должен вызывать ошибку если delay меньше 0 и больше 5000.
    4. TimeManager должен вызывать ошибку если поле interval содержит неверный тип
    или отсутствует.
    5. TimeManager должен вызывать ошибку если поле job содержит неверный тип или
    отсутствует.
    6. TimeManager должен вызывать ошибку если запустить метод add после старта.
    7. TimeManager должен вызывать ошибку если попытаться добавить таймер с именем
    котрое уже было добавлено.
 */