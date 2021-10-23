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
  return db.createTable("books_tags", {
    id: {
      type: "int",
      notNull: true,
      unsigned: true,
      autoIncrement: true,
      primaryKey: true,
    },
    book_id: {
      type: "int",
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: "books_tags_book_fk",
        table: "books",
        mapping: "id",
        rules: {
          onDelete: "CASCADE",
        },
      },
    },
    tag_id: {
      type: "int",
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: "books_tags_tag_fk",
        table: "tags",
        mapping: "id",
        rules: {
          onDelete: "CASCADE",
        },
      },
    },
  });
};

exports.down = function (db) {
  db.removeForeignKey(
    "books_tags",
    "books_tags_book_fk",
    function () {
      db.removeColumn("books_tags", "book_id")
    }
  );
  db.removeForeignKey(
    "books_tags",
    "books_tags_tag_fk",
    function () {
      db.removeColumn("books_tags", "tag_id")
    }
  );
  return db.dropTable("books_tags")
};

exports._meta = {
  "version": 1
};