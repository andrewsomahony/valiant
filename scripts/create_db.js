#!/usr/bin/env mongo

// Make sure mongod is running before running this script!

mongoConnection = new Mongo();
db = mongoConnection.getDB("local");

db = db.getSiblingDB('valiantLocal');