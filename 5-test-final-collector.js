'use strict';

const { collect } = require('./4-class-final-ver');
const assert = require('assert');

// #1

{
	const kc = collect(['key1', 'key2', 'key3'])
		.timeout(2000)
		.done((err, result) => {
			assert.ok(err);
			assert.strictEqual(Object.keys(result).length, 2);
			console.log();
			console.log('#1', 'Test timeout', result, '  ', err);
			console.log();
		});

	kc.collect('key1', null, 1);
	kc.collect('key1', null, 2);
	kc.collect('key2', null, 2);
}

// #2

{
	const kc = collect(['key1', 'key2', 'key3'])
		.timeout(5000)
		.distinct()
		.done((err, result) => {
			assert.ifError(err);
			assert.strictEqual(Object.keys(result).length, 3);
			console.log('#2', 'Test distinct:', result);
		});

	kc.collect('key1', null, 1);
	kc.collect('key1', null, 2);
	kc.collect('key2', null, 2);
	kc.collect('key3', null, 3);
}


// #3

{
	const dc = collect(3)
		.timeout(5000)
		.done((err, result) => {
			assert.ifError(err);
			assert.strictEqual(Object.keys(result).length, 3);
			assert.strictEqual(result.key3, 3)
			console.log();
			console.log('#3', 'Test dc: pick, collect, take methods:', result);
		});

	const asyncReturn = (x, cb) => {
		setTimeout(() => {
			cb(null, x);
		}, 1000);
	}

	dc.pick('key1', 1);
	dc.collect('key2', null, 2);
	dc.take('key3', asyncReturn, 3);
	dc.take('key4', asyncReturn, 5);
}