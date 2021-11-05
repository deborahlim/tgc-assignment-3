'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable("order_items", {
    id: {
      type: "int",
      primaryKey: true,
      autoIncrement: true,
      unsigned: true
    },
    quantity: {
      type: "int",
      unsigned: true
    },
    order_id: {
      type: "string",
      notNull: true,
      foreignKey: {
        name: "order_items_order_fk",
        table: "orders",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "RESTRICT",
        },
        mapping: "id",
      },
    },
    book_id: {
      type: "int",
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: "order_items_book_fk",
        table: "books",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "RESTRICT",
        },
        mapping: "id",
      },
    },
  });
};

exports.down = function(db) {
  return db.removeForeignKey(
    "order_items",
    "order_items_order_fk",
    async function () {
      await db.removeColumn( "order_items", "order_id" )
      db.removeForeignKey(
        "order_items",
        "order_items_book_fk",
        async function () {
          await db.removeColumn( "order_items", "book_id" )
          db.dropTable( "order_items" );
        }
      );
    }
  );
  
  
};

exports._meta = {
  "version": 1
};
