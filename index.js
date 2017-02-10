'use strict'

// TODO:
// use debug to have a human-readable execution log
// and winston + keenio for errors peristant logging
var debug = require('debug')('daili')
var winston = require('winston')
var Keen = require('keen-js')

var EventLogger = new Keen({
  projectId: process.env.KEEN_PROJECT_ID,
  writeKey: process.env.KEEN_WRITE_KEY
})
var ProxyVerifier = require('proxy-verifier')
var Evilscan = require('evilscan')
var Scanner = new Evilscan({
  target: '165.234.103.0/21',
  port: '8080',
  status: 'TROU',
  banner: true
})

Scanner.on('result', function (data) {
  if (data.status.indexOf('open') !== -1) {
    ProxyVerifier.testAll({
      ipAddress: data.ip,
      port: data.port,
      protocols: ['http', 'https']
    }, function (error, result) {
      if (error) console.log(error)
      else {
        Object.keys(result.protocols).forEach(function (protocol) {
          if (result.protocols[protocol].ok === true) {
	    EventLogger.addEvent('proxy', {
	      proxy: data,
	      details: result
	    }, function (error, result) {
	      if (error) console.log('EventLoggerError:', error)
	      else console.log(result)
	    })
            console.log(result)
          }
        })
      }
    })
  }
})

Scanner.on('error', function (error) {
  console.log(error)
})

try {
  Scanner.run()
} catch (e) { console.log(e) }
