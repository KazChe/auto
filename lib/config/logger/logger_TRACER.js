// Configuration of tracer for logging

var logger =
    require('tracer').dailyfile(
        {
            root:'./logs',
            level: 0,
            format : "{{timestamp}} <{{title}}> ({{file}}:{{line}}) {{message}} ",
            dateformat : "HH:MM:ss.L mm/dd"
        });

module.exports = logger;