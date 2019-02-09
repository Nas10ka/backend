'use strict';
/**
 * Реализовать класс Ui который будет
 * имплементировать Readable интерфейс и будет 
 * служить поставщиком данных.
 */
const { Readable } = require('stream');

class Ui extends Readable {
    constructor(data, options) {
        super(options);
        this.data = data;

        this.init();
    }

    init() {
        this.on('data', chunk => {
            console.log(chunk);
        })
    }

    _read() {
        let data = this.data.shift();
        if(!data) {
            this.push(null);
        } else {
            this.push(data);
        }
    }
}

class Guardian {
    constructor() {

    }
}

class AccountManager {
    constructor() {

    }
}
const customers = [
    {
        name: 'Pitter Black',
        email: 'pblack@email.com',
        password: 'pblack_123'
    },
    {
        name: 'Oliver White',
        email: 'owhite@email.com',
        password: 'owhite_456'
    }
];
const options = {
    objectMode: true,
    highWaterMark: 1
};
const ui = new Ui(customers, options);
const guardian = new Guardian();
const manager = new AccountManager();

// ui.pipe(guardian).pipe(manager);