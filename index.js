'use strict'

// TODO:
// use debug to have a human-readable execution log
// and winston + keenio for errors peristant logging
var debug = require('debug')('daili')
var winston = require('winston')
var keenio = require('keen.io')

var ProxyVerifier = require('proxy-verifier')
var Evilscan = require('evilscan')
var Scanner = new Evilscan({
  target: '218.56.132.1/20',
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

Scanner.run()
