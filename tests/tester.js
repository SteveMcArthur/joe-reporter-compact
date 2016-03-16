/*global require, module*/
function runTests(callback) {
    "use strict";
    var joe = require("joe");
    //var assert = require("assert-helpers");
    //var assert = require("assert");
    var chai = require('chai');
    var assert = chai.assert;
    var Reporter = require('../index');

    var compact = new Reporter({onFinish:callback});

    joe.setReporter(compact);

    try {

        joe.suite("Boolean tests", function (suite, test) {
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
            var items = ["Test1", "Test2", "Test3", "Test4", "Test5"];
            items.forEach(function (testName, idx) {
                var val = (idx % 2 === 0) ? true : false;
                var msg = "I'm " + val;
                test(testName + ": " + msg, function () {
                    assert.equal(true, val, msg);
                });
            });
        });

        joe.suite("String tests", function (suite, test) {
            this.setNestedConfig({
                onError: 'ignore'
            });
            test("Test of 'Something' should pass", function () {
                assert.equal("Something", "Something", "I'm 'Something");
            });

            test("Test of 'Something Else' should fail", function () {
                assert.equal("Something Else", "Something", "I'm NOT 'Something Else'");
            });

            test("Test of 'Another thing' should run and pass", function () {
                assert.equal("Another thing", "Another thing", "I'm 'Another thing'");
            });

        });
        joe.suite("Number tests", function (suite, test) {
            this.setNestedConfig({
                onError: 'ignore'
            });
            test("Test of '1.1415' should pass", function () {
                assert.equal(1.1415, 1.1415, "I'm '1.1415");
            });

            test("Test of '1.1415' should fail", function () {
                assert.equal(1.1415, 1.1416, "I'm NOT '1.1415'");
            });

            test("Test of '143.08' should run and pass", function () {
                assert.equal(143.08, 143.08, "I'm '143.08'");
            });

        });
        joe.suite("Null tests", function (suite, test) {
            this.setNestedConfig({
                onError: 'ignore'
            });
            test("Test of true and null", function () {
                assert.equal(true, null, "I'm NOT true");
            });

            test("Test of '1.1415' and null", function () {
                assert.equal(1.1415, null, "I'm NOT '1.1415'");
            });

            test("Test of 'Something' and null", function () {
                assert.equal("Something", null, "I'm NOT 'Something'");
            });

            test("Test of null and null", function () {
                assert.equal(null, null, "I'm null");
            });

        });
    } catch (err) {
        console.log("ERROR IN TEST SUITES.....");
        console.log(err);
    }
}

module.exports = runTests;