var Jasmine = require('jasmine');
var jasmine = new Jasmine();
var SpecReporter =  require('jasmine-spec-reporter');
var noop = function(){};

jasmine.configureDefaultReporter({print: noop});
jasmine.addReporter(new SpecReporter());
jasmine.loadConfigFile('spec/support/jasmine.json');

jasmine.execute();