import {
    Rec
} from "../src";

let time, timeSpentNew, timeSpentOld;

function percent() {
    console.log('==============================');

    if (timeSpentOld < timeSpentNew) {
        console.log((timeSpentNew / timeSpentOld * 100 - 100) + '% faster');
    } else {
        console.log((timeSpentOld / timeSpentNew * 100 - 100) + '% slower');
    }

    console.log('==============================');
    console.log();
}

function start() {
    time = new Date().getTime();
}

function stop(title, ops) {
    timeSpentOld = timeSpentNew;

    timeSpentNew = new Date().getTime() - time;

    console.log('------------------------------');
    console.info(title);
    console.log();
    console.log('Total ops.: ' + ops);
    console.log('Time spent: ' + timeSpentNew + ' ms');
    console.log('Ops. per second: ' + (1000 / timeSpentNew * ops));
    console.log('Time per single op.: ' + (timeSpentNew / ops) + ' ms');
    console.log();
}


interface Test {
    a: number;
    b: {
        b0: number;
        b1: {
            b10: number;
            b11: {
                b110: number;
                b111: number;
            }
        }
    };
    c: number;
    d: number;
    e: number;
    f: number;
    g: number;
    h: number;
    i: number;
    j: number;
}

let TestRecClass = Rec<Test>({a: 0, b: {b0: 1, b1: {b10: 1, b11: {b110: 1, b111: 2}}}, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7, i: 8, j: 9});

let r = new TestRecClass();

let objKey1 = ['a'];
let objKey2 = ['b', 'b1', 'b11', 'b111'];


// Rec (path - 0) set existing index with same value
start();

for (let i = 0; i < 10000000; i ++) {
    r.set(objKey1, 0);
}

stop('Rec (path - 0) set existing index with same value', 10000000);

// Rec (path - 1.b1.b11.b111) set existing index with same value
start();

for (let i = 0; i < 10000000; i ++) {
    r.set(objKey2, 2);
}

stop('Rec (path - 1.b1.b11.b111) set existing index with same value', 10000000);

// Rec (path - 0, 10 props to be copied) set existing index with new value
start();

for (let i = 0; i < 10000000; i ++) {
    r.set(objKey1, 1);
}

stop('Rec (path - 0, 10 props to be copied) set existing index with new value', 10000000);

// Rec (path - 1.b1.b11.b111, 14 props to be copied) set existing index with new value
start();

for (let i = 0; i < 10000000; i ++) {
    r.set(objKey2, 3);
}

stop('Rec (path - 1.b1.b11.b111, 14 props to be copied) set existing index with new value', 10000000);
