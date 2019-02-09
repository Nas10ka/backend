/*
  Таймеры могут быть как одноразовыми (выполнить задачу через определённый
  промежуток времени), так и периодическими (выполнять задачу с определённым
  интервалом). Если interval = true — таймер периодический.
 */

const t1 = {
  name: 't1',
  delay: 500,
  interval: false,
  job: () => console.log('t1')
};

const t2 = {
  name: 't2',
  delay: 3000,
  interval: false,
  job: (a, b) => a + b
};

const t3 = {
  name: 't3',
  delay: 2000,
  interval: false, 
  job: () => { throw new Error('We have a problem')}
}

const t4 = {
  name: 't4',
  delay: 5000,
  interval: false, 
  job: n => n
}

const tick = {
  name: 'tick',
  delay: 1000,
  interval: true,
  job: (a, b) => console.log(a + b)
};

class TimersManager {
  constructor() {
    this.timers = [];
    this.methods = [];
    this.startedTimers = {};
    this.names = [];
    this.logs = {};
    this.delays = [];
    this.logData = {};
  }

  _log(data) {
    const { name, input, out, created } = data;

    this.logs[name] = { name, in: input, out, created };
    return this;
  }

  print() {
    const logs = Object.values(this.logs);

    return logs;
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

      if (this.names.includes(timer.name)) {
        throw new Error('Error: Timer has been already added'); 
      } else {
        this.names.push(timer.name);
        this.delays.push(timer.delay);
          console.log('Tick timer job', timer.job);

        const data = {
          name: timer.name,
          input: args,
          out: timer.job.apply(timer.job, args),
          created: new Date()
        };
        
        this._log(data)
      }
      this.timers.push({ timer, args });

    
      return this;
    } catch (e) {
      if(e) {
        const data = {
          name: timer.name,
          input: args,
          out: timer.job,
          created: new Date(),
          error: e
        };
        this._log(data);
      }

    } finally {
      console.log(this.print());
      return this
    }

  }

  resume(name) {
    // Запускает работу конкретного таймера

    const { delay, interval, job, args } = this.startedTimers[name];
    global[name] = interval ? setInterval(job, delay, ...args) : setTimeout(job, delay, ...args);
    // this.timers
    return this;
  }

  remove(name) {
    /* Должен остановить определенный таймер и удалить его из очереди
    */
    this.names.filter(name => name !== name);
    this.timers = this.timers.filter(({ timer }) => {
      
      if(timer.name === name) {
        timer.interval ? clearInterval(global[name]) : clearTimeout(global[name]);
      }
      
      return timer.name !== name
    } )
    
    
    this.methods.push('remove');

    return this;
  }

  start() {
    // Должен запустить все таймеры на выполнениею
    let maxDelay = 0;
    this.delays.map(item => maxDelay < item ? maxDelay = item : maxDelay);;

    this.methods.push('start');
    
    this.timers.map(({ timer, args }, key) => {
      timer.interval ?
        global[timer.name] = setInterval(timer.job, timer.delay, ...args) :
        global[timer.name] = setTimeout(timer.job, timer.delay, ...args);
      this.startedTimers[timer.name] = { 
        timerId: timer.name,
        start: new Date(),
        delay: timer.delay,
        interval: timer.interval,
        job: timer.job,
        args
      } 
    });

    setTimeout(() => {
      this.names.map((name) => {
        if (name && this.startedTimers[name]) {
          const { interval } = this.startedTimers[name]
          interval ?
            clearInterval(global[name]) :
            clearTimeout(global[name])
        }
      });
    }, maxDelay + 10000);

    return this;
  }

  stop(name) {
    // Должен остановить все таймеры
    
    this.startedTimers[name].interval ?
      clearInterval(global[name]):
      clearTimeout(global[name]);
    this.methods.push('stop');
    return this;
  }

  pause(name) {
    // Приостанавливает работу конкретного таймера
    this.methods.push('pause');
    const { start, delay, interval } = this.startedTimers[name];
    let remaining = delay;
    interval ? clearInterval(global[name]) : clearTimeout(global[name]);
    remaining -= new Date() - start;
    this.startedTimers[name].delay = remaining;
    
    return this;
  }
}

const manager = new TimersManager();


manager.add(t1).add(t2, 2, 5).add(t3).add(t4, 'Hello, World!').add(tick, 11, 122);
// manager.add(tick, 10, 123);
// manager.add(t1);
manager.start();
// manager.remove('t2');
// manager.stop('t1');
// manager.add(t1).add(t2, 1, 2);
console.log(1);

// manager.add(t1).add(t2, 1, 2);
// manager.pause('t1');
// const resume = () => manager.resume('t1');
// setTimeout(resume, 5000);
setTimeout(() => console.log(manager.print()), 100);
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