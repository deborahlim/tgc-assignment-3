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
  return db.createTable("authors_books", {
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
        name: "authors_books_book_fk",
        table: "books",
        mapping: "id",
        rules: {
          onDelete: "CASCADE",
        },
      },
    },
    author_id: {
      type: "int",
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: "authors_books_author_fk",
        table: "authors",
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
    "authors_books",
    "authors_books_book_fk",
    function () {
      db.removeColumn("authors_books", "book_id")
    }
  );
  db.removeForeignKey(
    "authors_books",
    "authors_books_tag_fk",
    function () {
      db.removeColumn("authors_books", "tag_id")
    }
  );
  return db.dropTable("authors_books")
};

exports._meta = {
  "version": 1
};