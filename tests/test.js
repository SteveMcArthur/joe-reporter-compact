/*global require, process*/
var runTests = require('./tester');
var assert = require('assert-helpers');
//var fs = require('fs');

function msg(txt, k) {
    console.log("    [" + k + "] " + txt + " \u001b[32m\u221A\u001b[m");
}


runTests(function (reporter) {
    console.log("runTests....");
    //fs.writeFileSync('errorLogs.json', JSON.stringify(reporter.errorLogs, null, 4), 'utf-8');
    // var expectedData = require('./reporter.json');
    var expectedErrLog = require('./errorLogs.json');
    var testCounter = 0;


    function isEqual(actual, expected, message) {
        testCounter++;
        assert.equal(actual, expected, message);
        msg(message, testCounter);
    }


    console.log("-----------------------");
    console.log("  \u001b[36mTest that the demo tests have run properly...\u001b[m");
    var errorLogs = reporter.errorLogs;

    var b = !!reporter;
    isEqual(b, true, "Reporter exists");

    isEqual(errorLogs.length, 8, "Error log length is 8");

    b = !!errorLogs[0].test.config;
    isEqual(b, true, "errorLogs[0].test.config exists");

    isEqual(errorLogs[0].test.config.name, "This test should fail", "errorLogs[0].test.config.name is 'This test should fail'");
    b = !!errorLogs[0].err;
    isEqual(b, true, "errorLogs[0].err exists");

    isEqual(errorLogs[0].err.name, "AssertionError", "errorLogs[0].err.name is 'AssertionError'");
    isEqual(errorLogs[0].err.actual, true, "errorLogs[0].err.actual is true");
    isEqual(errorLogs[0].err.expected, false, "errorLogs[0].err.expected is false");


    isEqual(!!reporter.onFinish, true, "Reporter has onFinish property");
    isEqual(reporter.actual, "Comparison Actual ", "Reporter has correct actual property");
    isEqual(reporter.expected, "Comparison Expected ", "Reporter has correct expected property");

    console.log("errorLogs.length: " + errorLogs.length);
    for (var i = 0; i < errorLogs.length; i++) {
        var log = errorLogs[i];
        for (var key in log.err) {
            if (typeof log.err[key] === "string") {
                isEqual(log.err[key], expectedErrLog[i].err[key], "log.err." + key + " = " + log.err[key]);
            }
        }
    }
    console.log("Traversed error logs...");
    process.exit(0);

});