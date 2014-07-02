module.exports = function(config) {
    config.set({

        // base path, used to resolve files and exclude
        basePath: '',

        // frameworks to use
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            //{pattern: 'node_modules/**/*.js', included: false},
            {pattern: 'lib/**/*.js', included: false},
            {pattern: 'src/**/*.js', included: false},
            {pattern: 'test/**/*.js', included: true},
        ],

        // list of files to exclude
        exclude: [
            'src/app.js'
        ],

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Start these browsers, currently available:
        browsers: ['Chrome'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        // Continuous Integration mode
        // if true, it captures browsers, runs tests, and exits
        singleRun: false
    });
};
