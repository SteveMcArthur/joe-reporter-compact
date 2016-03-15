/*global require*/

var joe = require("joe");
//var assert = require("assert-helpers");
//var assert = require("assert");
var chai = require('chai');
var assert = chai.assert;
var Reporter = require('../index');

var compact = new Reporter();

joe.setReporter(compact);

try {

    joe.suite("Assertion tests", function (suite, test) {
        this.setNestedConfig({
            onError: 'ignore'
        });

        test("This test should pass", function () {
            assert.equal(true, true, "I'm true");
        });

        test("This test should fail", function () {
            assert.equal(true, false, "I'm NOT true");
        });

        test("This test should run and pass", function () {
            assert.equal(1, 1, "I'm 1");
        });

    });

    joe.suite("Dynamic Tests", function (suite, test) {
        this.setNestedConfig({
            onError: 'ignore'
        });
        var items = ["Test1", "Test2", "Test3","Test4","Test5"];
        items.forEach(function (testName,idx) {
            test(testName, function () {
                var val = (idx % 2 === 0) ? true : false;
                assert.equal(true, val, "I'm true");
            });
        });
    });

    joe.suite("Assertion tests 2", function (suite, test) {
        this.setNestedConfig({
            onError: 'ignore'
        });
        test("This test should pass", function () {
            assert.equal(true, true, "I'm true");
        });

        test("This test should fail", function () {
            assert.equal(true, false, "I'm also NOT true");
        });

        test("This test should run and pass", function () {
            assert.equal(1, 1, "I'm 1");
        });

    });
} catch (err) {
    console.log("ERROR IN TEST SUITES.....");
    console.log(err);
}