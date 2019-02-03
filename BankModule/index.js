/*
  1. Реализовать метод register который будет регистрировать 
  нового контрагента. Метод возвращает идентификатор 
  контрагента (генеринуется автоматически модуле Bank).

  2. Реализовать поддержку события add которое принимает 
  идентификатор контрагента в качестве второго аргумента 
  и сумму зачисления в качестве третьего аргумента.

  3. Реализовать поддержку события get которое принимает 
  идентификатор контрагента в качестве второго аргумента 
  и callback функцию в качестве третьего аргумента.
  Callback пинимает один аргумент balance, который указывает на
  количество денег на момент генерации события. 

  4.Реализовать поддержку события withdraw которое принимает 
  идентификатор контрагента в качестве второго аргумента и
  сумму списания в качестве третьего аргумента. Событие должно
  списать деньги со счёта контрагента

  Обратите внимание! 

    1. Метод register должен вызывать ошибку при попытке 
      добавления двух контрагентов с одинаковыми именами.

    2. Метод register должен вызывать ошибку при попытке 
      добавления контрагента со значением balance меньше
      или равным нулю. 

    3. Событие add должно генерировать ошибку при попытке 
      зачислить отрицательную или нулевую сумму на счёт 
      контрагента. 

    4. Событие withdraw должно генерировать ошибку при попытке
      списать отрицательную сумму co счёта контрагента.
    
    5. Событие withdraw должно генерировать ошибку при попытке 
      списать сумму со счёта контрагента если после списания счёт 
      контрагента будет меньше нуля.

    6. Все события должны генерировать ошибку если им передан 
      не существующий идентификатор контрагента.
    
    7. Генерирование и обработку ошибок необходимо реализовать
      при помощи события error. 

*/
const uuid = require('uuid/v1');

class Bank {
  constructor() {
    this.registers = {};
    this.ids = [];
    this.persons = [];
    this.error = '';
  }
  
  _registerIsValid (person) {
    const { name, balance } = person;
    const exists = this.persons.filter(person => person.name === name);
    if(exists.length) {
      this.error = 'The person with this name already exists.' ;
      return false;
    }
    if(balance <= 0) {
      this.error = 'The balance should be greater than zero.';
    }
    return true;   
  }

  _sumIsValid (sum) {
    if(sum <= 0) {
      this.error = 'You can\'t add or subtract the sum smaller than zero.'
      return false;
    }
    return true;
  }

  register(person) {
      if (!this._registerIsValid(person)) 
        return this.on('error', this.error);

      const id = uuid();
      const customer = {
        id,
        ...person
      };
      this.registers[id] = customer;
      this.ids.push(id);
      return id;
  }

  add (id, sum) {
    if (!this._sumIsValid(sum)) 
      return this.on('error', this.error);

    const { balance } = this.registers[id];
    return this.registers[id].balance = balance + sum;
    
  }

  get (id, callback){
    const { balance } = this.registers[id];
    return callback(balance);
  }

  _isEnoughMoney(id, sum) {
    const { balance } = this.registers[id];
    if(balance + 1 < sum) {
      this.error = 'The sum for withdrow is greater than current balance.'
      return false;
    }
    return true;
  }

  withdraw (id, sum) {
    if (!this._sumIsValid(sum)) 
      return this.on('error', this.error);

    const { balance } = this.registers[id];
    return this.registers[id].balance = balance - sum;
  }

  _isIdExists (id) {
   if(!this.ids.includes(id)) {
      this.error = 'The contragent doesn\'t exists.'
   }
  }

  error(msg) {
    throw new Error(msg);
  }

  emit(method, ...data) {
    this.on(method, data);
    return this
  }

  on (method, data) {
    try {
      this[method](...data);
    } catch(msg) {
      console.error(msg);
    }
  }

  changeLimit(id, callback) {
    this.registers[id].limit = callback; 
    consoe.log(this.registers[id]);

  }
 
  _isTransSumValid(bal, sum, lim) {
    switch(true) {
      case !lim(sum): {
        this.error = "The transfer limit exceeded."
        return false;
      }
      case (sum > bal + 1): {
        this.error = "The money is not enought."
        return false;
      } 
      case (0 >= sum): {
        this.error = "The sum for transaction must be greater than zero"
        return false;
      }
      default:
        return true;
    }
  }

  send(from, to, sum) {
    const { balance:balanceFrom, limit } = this.registers[from];
    if(!this._isTransSumValid(balanceFrom, sum, limit)) {
      this.on('error', this.error);
    }
    const balanceTo = this.registers[to].balance;
    this.registers[from].balance = balanceFrom - sum; 
    this.registers[to].balance = balanceTo + sum; 
    return this.registers;
  }
};

const bank = new Bank();

const personId1 = bank.register({
  name: 'Pitter Blank', // String - имя контрагента
  balance: 100, // Number - начальный баланс 
  limit: amount => amount < 100
});

const personId2 = bank.register({
  name: 'Qwerty Qwerty', // String - имя контрагента
  balance: 145, // Number - начальный баланс 
  limit: amount => amount < 100
}); 

bank.emit('add', personId1, 20);
bank.emit('add', personId2, 70);

bank.emit('withdraw', personId1, 50);
bank.emit('get', personId1, balance => {
  console.log(`I have ${balance}₴`);
});

bank.emit('get', personId2, balance => {
  console.log(`I have ${balance}₴`);
});
bank.emit('send', personId1, personId2, 20);

bank.emit('get', personId1, balance => {
  console.log(`I have ${balance}₴`);
});

bank.emit('get', personId2, balance => {
  console.log(`I have ${balance}₴`);
});

bank.emit('changeLimit', personId1, 
  (amount, currentBalance, updateBalance) => 
    amount < 100 && updateBalance > 700 && currentBalance > 800);

bank.emit('changeLimit', personId1, 
  (amount, currentBalance, updateBalance) => 
    amount < 100 && updateBalance > 700);

bank.emit('changeLimit', personId1, 
  (amount, currentBalance) => 
    currentBalance > 800);

bank.emit('changeLimit', personId1, 
  (amount, currentBalance, updateBalance) => 
    updateBalance > 900);
