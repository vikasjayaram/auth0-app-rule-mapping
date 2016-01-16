/*!
 * utils
 * Copyright(c) 2016 Vikas Jayaram <vikas.ramasethu@gmail.com>
 * MIT Licensed
 */
var _ = require('lodash');
var S = require('string');
var logicFilterString = require('logic-filter-strings');
var async = require('async');

function getContextClientParser (body) {
	var rules = [];
	var rulesParser = (typeof body == "string") ? JSON.parse(body) : body;
	_.each(rulesParser, function (item) {
		var rule_id = item.rule_id;
		var rule_name = item.name;
		var scriptLines = S(item.script).lines();
		_.each(scriptLines, function (line) {
			var replaceWhiteSpace = line.replace(/\n/g,'').replace(/ /g, '');
			var ifBlock = S(replaceWhiteSpace).between('if(', ')').s;
			if (ifBlock.indexOf('context.clientID') > -1) {
				var logicFilter = logicFilterString(ifBlock);
				_.each(logicFilter.value, function(idx) {
					if (typeof idx === "string" ) {
						if (idx == 'context.clientID') {
							console.log(idx);
							var obj = {rule_id: rule_id, rule_name: rule_name, client_id: _.last(logicFilter.value)};
							rules.push(obj);
						}
					}
					if (idx instanceof Array ) {
						if (idx[0] == 'context.clientID') {
							var obj = {rule_id: rule_id, rule_name: rule_name, client_id: idx[2]};
							rules.push(obj);
						}
					}
				});
			}
		});
	});
	return rules;
}

function getApplicationRules (rules, clients, applicationSpecificRules, genericRules) {
	//console.log(rules, clients);
	var result = [];
	_.each(clients, function (client) {
		_.each(applicationSpecificRules, function (applicationSpecificRule) {
			if (client.clientID == applicationSpecificRule.client_id) {
				var newEntry = {};
				newEntry.name = client.name;
				newEntry.client_id = client.clientID;
				newEntry.rules = [];
				delete applicationSpecificRule.client_id;
				newEntry.rules.push(applicationSpecificRule);
				result.push(newEntry);				
			}
		});
	});
	_.each(clients, function (client) {
		_.each(genericRules, function (genericRule) {
			var currRecord = _.find(result, {name: client.name});
			if (currRecord) {
				currRecord.rules = (currRecord.rules) ? currRecord.rules : [];
				currRecord.rules.push(genericRule);
			} else {
				var newEntry = {};
				newEntry.name = client.name;
				newEntry.client_id = client.clientID;
				newEntry.rules = [];
				newEntry.rules.push(genericRule);
				result.push(newEntry);
			}

		});
	})
	return result;
}

function getAllRules (rules) {
	var allRules = [];
	var rulesParser = (typeof rules == "string") ? JSON.parse(rules) : rules;
	_.each(rulesParser, function (rule) {
		allRules.push({rule_id: rule.rule_id, rule_name: rule.name});
	});
	return allRules;
};

function getAllApplicableRulesExcludingAppSpecific (rules, applicationSpecificRules) {
	var intersectedArray = _.differenceBy(rules, applicationSpecificRules, 'rule_id');
	return intersectedArray;	
};

exports.appToRulesMapping = function (res, callback) {
	var rules = res.rules ? res.rules : [];
	var clients = res.clients ? res.clients : [];
	var applicationSpecificRules = getContextClientParser(rules);
	var allRules = getAllRules(rules);
	var genericRulesApplicationToAllApps = getAllApplicableRulesExcludingAppSpecific(allRules, applicationSpecificRules);
	var result = getApplicationRules(rules, clients, applicationSpecificRules, genericRulesApplicationToAllApps);
	if (callback) callback(result);	
};