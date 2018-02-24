#!/usr/bin/env node
var program = require('commander');
var request = require('request');
var inquirer = require('inquirer');

program
  .version('0.1.0')
  .arguments('<cmd>')
  .action(function (cmd) {
     cmdValue = cmd;
  });

program.parse(process.argv);

if (typeof cmdValue === 'undefined') {
  console.error('no command given!');
  process.exit(1);
}

if (cmdValue === 'add-bucket') {
	getToken(function(token) {
		addBucket(token, function(res) {
			console.log(res)
		})
	})
}

function getToken(callback) {
	const questions = [
		{
			type: 'text',
			name: 'email',
			message: 'Email:'
		},
		{
			type: 'password',
			name: 'password',
			message: 'Password:'
		}
	]
	inquirer.prompt(questions).then(function (answers) {
		request.post({ url: 'https://api.cosmicjs.com/v1/authenticate', form: {email: answers.email, password: answers.password }}, function(err, httpResponse, body){
			return callback(JSON.parse(body).token)
		})
	})
}

function addBucket(token, callback) {
	const questions = [
		{
			type: 'text',
			name: 'title',
			message: 'What is the title of your new Bucket?'
		}
	]
	inquirer.prompt(questions).then(function (answers) {
		const headers = {
      'Authorization': `Bearer ${token}`
    }
		request.post({ headers, url: 'https://api.cosmicjs.com/v1/buckets', form: { title: answers.title } }, function(err, httpResponse, body){
			return callback(JSON.parse(body))
		})
	})
}
