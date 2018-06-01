'use strict';
const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

const mongodb = require('mongodb');
const collection = 'articles';
const mongo_uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
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

router.get(`/${collection}`, async function(req, res) {
	const conn = await getDBConnection();
	conn
		.collection(collection)
		.find({})
		.toArray(function(err, docs) {
			if (err) {
				logger.error(err);
			} else {
				res.status(200).json(docs);
			}
		});
});

router.get(`/${collection}/:id`, async function(req, res) {
	const conn = await getDBConnection();
	let oid;
	try {
		oid = new mongodb.ObjectId(req.params.id);
	} catch (e) {
		logger.error(e);
		res.status(400).send(e);
		return;
	}
	conn.collection(collection).findOne({ _id: oid }, function(err, docs) {
		if (err) {
			logger.error(err);
			res.status(500).send('Server failed to handle request. Admin should check logs');
		} else {
			res.status(200).json(docs);
		}
	});
});

router.post(`/${collection}`, async function(req, res) {
	const newEntry = req.body;
	const conn = await getDBConnection();
	conn.collection(collection).insertOne(newEntry, function(err, doc) {
		if (err) {
			logger.error(err);
			res.status(500).send('Server failed to handle request. Admin should check logs');
		} else {
			res.status(201).json(doc.ops[0]);
		}
	});
});

module.exports = router;
