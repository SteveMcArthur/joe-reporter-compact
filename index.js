/*global process, module, require, window*/
"use strict";
var util = require('util');
var ConsoleReporter = require('joe-reporter-console');
var fs = require('fs');
var path = require('path');

var isBrowser = (typeof window === 'undefined') ? false : true;
var isWindows = process ? process.platform.indexOf('win') > -1 : false;
var cliColor = null;
if (!isBrowser) {
    try {
        cliColor = require('cli-color');
    } catch (err) {}
}



function CompactReporter(config) {

    config = config || {};
    var fail = config.fail ? config.fail : isWindows ? ' X ' : ' ✘  ';
    var pass = config.pass ? config.pass : isWindows ? ' \u221A ' : ' ✔  ';
    CompactReporter.super_.call(this, config);
    this.tty = ((process.stdout && process.stdout.isTTY === true) && (process.stderr && process.stderr.isTTY === true)) || false;
    this.useColors = (process ? process.argv.indexOf('--no-colors') > -1 : false) ? (cliColor === null) : true;
    this.actual = "Comparison Actual ";
    this.expected = "Comparison Expected ";
    this.indent = '    ';
    this.config.fail = this.useColors ? this.color(fail, "red", "bold") : fail;
    this.config.pass = this.useColors ? this.color(pass, "green", "bold") : pass;
    this.errorLogs = [];
    this.onFinish = this.config.onFinish || function () {};
    this.hideSuccess = this.config.hideSuccess || false;

}

util.inherits(CompactReporter, ConsoleReporter);


CompactReporter.prototype.color = function (value, color, style) {
    if (this.useColors) {
        if (color && cliColor) {
            if (style) {
                value = cliColor[color][style](value);
            } else {
                value = cliColor[color](value);
            }
        }
    }
    return value;
};

CompactReporter.prototype.startTest = function (test) {
    /*    var name = test.getConfig().name;
        if (!name) {
            return;
        }

        var message = this.indent + name;
        console.log(message);*/

};

CompactReporter.prototype.finishTest = function (test, err) {
    var name = test.getConfig().name;
    if (!name) {
        return;
    }

    var check = err ? this.config.fail : this.config.pass;

    var message = this.indent + name + check;
    if (err) {
        message = this.color(message, "red","bold");
    }
    if(!this.hideSuccess || err){
        console.log(message);
    }
    
    if (err && err.actual) {
        var actual = this.color(err.actual, "yellow");
        var expected = this.color(err.expected, "yellow");
        console.log(this.indent + this.indent + this.actual, actual);
        console.log(this.indent + this.indent + this.expected, expected);
    }

};

CompactReporter.prototype.finishSuite = function (suite, err) {
    var name = this.getItemName(suite);
    if (!name) {
        return;
    }
    var check = err ? this.config.fail : this.config.pass;
    var message = name + check;
    console.log(message);
    console.log("-----------------------------" + "\n");
};

var summary = "";
function log(message){
    console.log(message);
    summary+= message+"\n";
}


CompactReporter.prototype.exit = function (exitCode) {
    var totals = this.joe.getTotals();
    var totalTests = totals.totalTests;
    var totalPassedTests = totals.totalPassedTests;
    var totalFailedTests = totals.totalFailedTests;
    var totalIncompleteTests = totals.totalIncompleteTests;
    var totalErrors = totals.totalErrors;

    if (exitCode) {
        var errorLogs = this.joe.getErrorLogs();
        var self = this;
        errorLogs.forEach(function (item) {
            self.errorLogs.push(item);
        });
        summary = "";
        var msg = util.format(this.config.summaryFail, totalPassedTests, totalTests, totalFailedTests, totalIncompleteTests, totalErrors);
        log(msg);
        log("-----------------------------");
        log(this.color("Error summary:", "red","bold"));
        var lastSuit = "";
        for (var i = 0; i < errorLogs.length; i++) {
            var errorLog = errorLogs[i];
            var test = errorLog.test;
            var suite = test.getConfig().parent.getConfig().name;
            if (suite !== lastSuit) {
                log("Suite: "+ suite);
                lastSuit = suite;
            }

            log(this.indent+ (i + 1) + ": "+ test.getConfig().name);
        }

        log("-----------------------------");
    } else {
        log("\n" + util.format(this.config.summaryPass, totalPassedTests, totalTests));
    }
    summary = summary.replace(/\[\d+m/g,'');
    var outfile = path.join(process.cwd(),"summary.txt");
    fs.writeFileSync(outfile,summary,'utf-8');
    this.onFinish(this);

};

module.exports = CompactReporter;