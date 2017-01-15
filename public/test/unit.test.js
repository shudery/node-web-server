var mocha = require('mocha')
var expect = require('chai').expect
var log = require('../../lib/daguo').log

describe('Unit Tests',()=>{
	it('log modules',()=>{
		expect(typeof log('test') === 'string')
	})
})