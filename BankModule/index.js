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
      списать отрицательную сумму

*/
const uuid = require('uuid/v1');
const EventEmitter = require('events');

class Bank {
  constructor() {
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
        return this.on('Error', this.error);

      const id = uuid();
      const customer = {
        id,
        ...person
      };
      this.persons.push(customer);
      return id;
  }

  add (id, sum) {
    if (!this._sumIsValid(sum)) 
      return this.on('Error', this.error);

    this.persons = this.persons.map(person => 
      person.id === id ? 
      {...person, balance: person.balance + sum } : 
      person);
    return this;
  }

  get (id, callback){
    this.persons.map(person => 
      person.id === id ? 
      callback(person.balance) :
      person
    );
    return this;
  }

  _isEnoughMoney(id, sum) {
    const person = this.persons.filter(p => p.id === id);
    if(person.balance + 1 < sum) {
      this.error = 'The sum for withdrow is greater than current balance.'
      return false;
    }
    return true;
  }

  withdraw (id, sum) {
    if (!this._sumIsValid(sum)) 
      return this.on('Error', this.error);

    this.persons = this.persons.map(person => 
      person.id === id ? 
      { ...person, balance: person.balance - sum } :
      person
    );
    return this;
  }

  emit(method, ...data) {
    this[method](...data);
    return this
  }

  on (method, msg) {
    throw Error(msg);
    try {

    } catch(msg) {
      console.error(msg);
    }
  }

  changeLimit(personId, callback) {
    console.log()
    // const { name, balance } = 
  }

  send(personFrom, personTo) {
    // this.on('Error', 'The sum for trunsaction must be greater then zero');
  }
};
const bank = new Bank();

const personId1 = bank.register({
  name: 'Pitter Blank', // String - имя контрагента
  balance: 100, // Number - начальный баланс 
  limit: amount => amount < 10
});

const personId2 = bank.register({
  name: 'Qwerty Qwerty', // String - имя контрагента
  balance: 145, // Number - начальный баланс 
  limit: amount => amount < 100
}); 

bank.emit('add', personId1, 20);
bank.emit('add', personId2, 70);

bank.emit('get', personId1, balance => {
  console.log(`I have ${balance}₴`);
});
bank.emit('withdraw', personId1, 50);
bank.emit('get', personId1, balance => {
  console.log(`I have ${balance}₴`);
});

bank.emit('send', personId1, personId2);

