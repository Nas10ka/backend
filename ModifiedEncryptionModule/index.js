'use strict';
/**
 *
 */
const { Readable, Transform, Writable } = require('stream');
const { EventEmitter } = require('events');

class DB extends EventEmitter {
    constructor(props) {
        super(props);
        this.database = [];
    }

    store (data) {

        this.database.push(data);
        console.log(this.database);
        return data;
    }

    emit(method, data) {
        this.on(method, data);
        return data;
    }

    on (method, data) {

        this[method](data);
    }
}

class Ui extends Readable {
    constructor(data, options) {
        super(options);
        this.data = data;
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

class Logger extends Transform {
    constructor(props) {
        super(props);
        this.logs = [];
        this.data = [];
        this.db = new DB();
        console.log('Logger db ', this.data);
        
        const {
            objectMode,
            highWaterMark,
            decodeStrings,
            getBuffer
        } = this._writableState;

    }

    createLogger(data) {
        const db = new DB();

        const { meta, payload } = data;
        const log = {
            source: meta.source,
            payload,
            created: new Date()
        };
        this.data = this.db.emit('store', log);
        this.logs.push(log);
    }

    _transform (chunk, encoding, done) {
        this.createLogger(chunk);
        this.push(chunk);
        done();
    }
}

class Guardian extends Transform{
    constructor(options = {}) {
        super(options);
        this.transformedData = {};
        const {
            objectMode,
            highWaterMark,
            decodeStrings
        } = this._writableState;
        
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

const t_options = {
    readableObjectMode: true,
    writableObjectMode: true,
    decodeStrings: false
};

const w_options = {
    objectMode: true
};

const options = {
    objectMode: true,
    highWaterMark: 1
};

const ui = new Ui(customers, options);
const guardian = new Guardian(t_options);
const manager = new AccountManager(w_options);
const logger = new Logger(t_options);

ui.pipe(guardian).pipe(logger).pipe(manager);