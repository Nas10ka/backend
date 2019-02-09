'use strict';
/**
 * Реализовать класс Ui который будет
 * имплементировать Readable интерфейс и будет 
 * служить поставщиком данных.
 */
const { Readable, Transform, Writable } = require('stream');

class Ui extends Readable {
    constructor(data, options) {
        super(options);
        this.data = data;

        this.init();
    }

    init() {
        this.on('data', chunk => {
            // console.log(chunk);
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


const t_options = {
    readableObjectMode: true,
    writableObjectMode: true,
    decodeStrings: false
};

const w_options = {
    objectMode: true
};

class Guardian extends Transform{
    constructor(options = {}) {
        super(options);
        this.transformedData = {};
        const {
            objectMode,
            highWaterMark,
            decodeStrings
        } = this._writableState;
        
        this.init();
    }

    init () {
        
    }

    asciiToHexa (str) {
        const strLength = str.length;
        let arr = [];
        for(let n = 0; n < strLength; n++) {
            const hex = Number(str.charCodeAt(n)).toString(16);
            arr.push(hex);
        }
        return arr.join('');
    }

    _transform (chunk, encoding, done) {
        const { name, email, password } = chunk;
        const data = {
            meta: {
                source: 'ui'
            },
            payload: {
                name,
                email: this.asciiToHexa(email),
                password: this.asciiToHexa(password)
            }
        }
        this.push(data);
        done();
    }

    _flush (done) {
        done();
    }
}

class AccountManager extends Writable {
    constructor(props) {
        super(props);
        
        const {
            objectMode,
            highWaterMark,
            decodeStrings,
            getBuffer
        } = this._writableState;
    }

    _write (chunk, encoding, done) {
        console.log(chunk.payload);
        done();
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
const guardian = new Guardian(t_options);
const manager = new AccountManager(w_options);

ui.pipe(guardian).pipe(manager);