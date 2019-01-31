/*
  1. Реализовать метод register который будет регистрировать 
  нового контрагента. Метод возвращает идентификатор 
  контрагента (генеринуется автоматически модуле Bank).
*/
const EventEmitter = require('events');

class Bank {
  constructor() {
    this.persons = [];
  }
  
  register(person) {
    this.persons.push(person);
    
    return this;
  }

  add (personId, sum) {
    console.log('Add', personId, sum);
    return this
  }

  get (personId, callback){
    console.log('get ', personId);
  }

  withdraw (personId) {

  }

  emit(method, ...data) {
    this[method](...data);
    return this
  }

  on (error, msg) {
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
    this.on('Error', 'The sum for trunsaction must be greater then zero');
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
// bank.emit('get', personId, balance => {
//   console.log(`I have ${balance}₴`)
// });
// bank.emit('withdraw', personId, 50);
bank.emit('get', personId1, balance => {
  console.log(`I have ${balance}₴`);
});

bank.emit('send', personId1, personId2);

