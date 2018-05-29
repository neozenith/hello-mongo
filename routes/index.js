'use strict';
const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

const mongodb = require('mongodb');
const mongo_uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
let db = null;

async function getDBConnection() {
	return new Promise(function(resolve, reject) {
		if (db) {
			resolve(db);
			return;
		}

		mongodb.MongoClient.connect(mongo_uri, function(err, client) {
			if (err) {
				logger.log(err);
				reject('Database connection not established');
				return;
			}
			db = client.db();
			logger.log('Database connection ready');
			resolve(db);
		});
	});
}

router.get('/', function(req, res) {
	res.send('Hello');
});

router.get('/test', async function(req, res) {
	const conn = await getDBConnection();
	conn
		.collection('test')
		.find({})
		.toArray(function(err, docs) {
			if (err) {
				logger.error(err);
			} else {
				res.status(200).json(docs);
			}
		});
});

router.post('/test', async function(req, res) {
	const newEntry = req.body;
	const conn = await getDBConnection();
	conn.collection('test').insertOne(newEntry, function(err, doc) {
		if (err) {
			logger.error(err);
		} else {
			res.status(201).json(doc.ops[0]);
		}
	});
});

module.exports = router;
