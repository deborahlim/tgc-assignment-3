'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable("books", {
    id: {
      type: "int",
      primaryKey: true,
      autoIncrement: true,
      notNull: true,
      unsigned: true
    },
    title: {
      type: "string",
      length: 100,
      notNull: false
    },
    cost: {
      type: "real",
      notNull: true
    },
    publishedDate: {
      type: "date",
      notNull: true
    },
    createdAt: {
      type: "timestamp",
      notNull: true,
      defaultValue: new String('now()')
    },
    stock: {
      type: "int",
      notNull: true
    },
    description: {
      type: "text"
    },
    imageUrl: {
      type: "string",
      length: 255,
    },
  });
};

exports.down = function (db) {
  return db.dropTable("books");
};

exports._meta = {
  "version": 1
};