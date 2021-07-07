'use strict'

const metasync = require('metasync');
const metatests = require('metatests');

// #1

metatests.test('data collector', test => {
	const expectedResult = {
		key1: 1,
		key2: 2,
		key3: 3,
	};

	const dc = metasync
		.collect(3)
		.done((err, result) => {
			test.error(err);
			test.strictSame(result, expectedResult);
			test.end();
		})
		.timeout(1000);

	dc.collect('key1', null, 1);
	dc.collect('key2', null, 2);
	dc.collect('key3', null, 3);
});

// #2

const assert = require('assert');

const dc = metasync
	.collect(3)
	.timeout(5000)
	.done((err, result) => {
		assert.ifError(err);
		assert.strictEqual(Object.keys(result).length, 3);
		console.log('#2', 'Test dc.pick method:', result);
		console.log();
	});

dc.pick('key1', 1);
dc.pick('key2', 2);
dc.pick('key3', 3);

// #3

const kc = metasync
	.collect(['key1', 'key2', 'key3'])
	.timeout(5000)
	.done((err, result) => {
		assert.ifError(err);
		assert.strictEqual(Object.keys(result).length, 3);
		console.log('#3', 'Test kc.pick method:', result);
		console.log();
	});

kc.pick('key1', 1);
kc.pick('key2', 2);
kc.pick('key3', 3);

// #4

{
	const dc = metasync
		.collect(3)
		.timeout(5000)
		.distinct()
		.done((err, result) => {
			assert.ifError(err);
			assert.strictEqual(Object.keys(result).length, 3);
			console.log('#4', 'Test dc.collect method:', result);
			console.log();
		});

	dc.collect('key1', null, 1);
	dc.collect('key1', null, 2);
	dc.collect('key2', null, 2);
	dc.collect('key3', null, 3);
}

// #5

{
	const kc = metasync
		.collect(['key1', 'key2', 'key3'])
		.timeout(5000)
		.distinct()
		.done((err, result) => {
			assert.ifError(err);
			assert.strictEqual(Object.keys(result).length, 3);
			console.log('#5', 'Test kc.collect method:', result);
			console.log();
		});

	kc.collect('key1', null, 1);
	kc.collect('key1', null, 2);
	kc.collect('key2', null, 2);
	kc.collect('key3', null, 3);
}

// #6

{
	const kc = metasync
		.collect(['key1', 'key2', 'key3'])
		.timeout(5000)
		.done((err, result) => {
			assert.ok(err);
			assert.strictEqual(Object.keys(result).length, 2);
			console.log();
			console.log('#6', 'Test kc.collect method:', result, '  ', err);
			console.log();
		});

	kc.collect('key1', null, 1);
	kc.collect('key1', null, 2);
	kc.collect('key2', null, 2);
}

// #7

{
	const dc = metasync
		.collect(3)
		.timeout(5000)
		.done((err, result) => {
			assert.ifError(err);
			assert.strictEqual(Object.keys(result).length, 3);
			assert.strictEqual(result.key3, 3)
			console.log();
			console.log('#7', 'Test dc: pick, collect, take methods:', result);
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