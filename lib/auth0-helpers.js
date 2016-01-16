/*!
 * auth0-app-rule-mapping
 * Copyright(c) 2016 Vikas Jayaram <vikas.ramasethu@gmail.com>
 * MIT Licensed
 */
var Auth0 = require('auth0');
var utils = require('./utils');
var async = require('async');

var api = new Auth0({
  domain:       process.env.AUTH0_DOMAIN,
  clientID:     process.env.AUTH0_GLOBAL_CLIENT_ID,
  clientSecret: process.env.AUTH0_GLOBAL_CLIENT_SECRET
});

exports.appToRulesMapping = function (cb) {
	async.parallel({
		clients: function (callback) {
			api.getClients(function (err, clients) {
				callback(err, clients);
			});
		},
		rules: function (callback) {
			api.getRules(function (err, rules) {
				callback(err, rules);
			});
		}
	}, function (err, results) {
		utils.appToRulesMapping(results, function(mapping) {
			cb(mapping);
		})
	});
}