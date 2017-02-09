'use strict'

// TODO:
// use debug to have a human-readable execution log
// and winston + keenio for errors peristant logging
var debug = require('debug')('daili')
var winston = require('winston')
var keenio = require('keen.io')

var PingProxy = require('ping-proxy')
var Evilscan = require('evilscan')
var Scanner = new Evilscan({
  target: '127.0.0.1/20',
  port: '8080',
  status: 'TROU',
  banner: true
})

Scanner.on('result', function (data) {
  if (data.status.indexOf('open') !== -1) {
    PingProxy({
      proxyHost: data.ip,
      proxyPort: 8080
    }, function (error, options, statusCode) {
      if (error) console.log('Error:', error)
      console.log(options, statusCode)
    })
  }
})

Scanner.on('error', function (error) {
  console.log(error)
})

Scanner.run()
