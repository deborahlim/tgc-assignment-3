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
  return db.addColumn("books", "genre_id", {
    type: "int",
    unsigned: true,
    notNull: true,
    foreignKey: {
      name: "book_genre_fk",
      table: "genres",
      rules: {
        onDelete: "cascade",
        onUpdate: "restrict"
      },
      mapping: "id"
    }
  });
};

exports.down = function (db) {
  return db.removeForeignKey(
    "books",
    "book_genre_fk",
    function () {
      db.removeColumn("books", "genre_id");
    }
  );
};

exports._meta = {
  "version": 1
};