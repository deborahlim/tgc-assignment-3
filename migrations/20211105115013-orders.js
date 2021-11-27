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
  return db.createTable("orders", {
    id: {
      type: "string",
      primaryKey: true,
      notNull: true,
    },
    amountTotal: {
      type: "real",
      unsigned: true,
      notNull: true,
    },
    createdAt: {
      type: "datetime",
      notNull: true
    },
    customer_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "order_customer_fk",
        table: "customers",
        mapping: "id",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "RESTRICT",
        },
      },
    }
  });
};

exports.down = function (db) {
  return db.removeForeignKey(
    "orders",
    "order_customer_fk",
    async function () {
      await db.removeColumn("orders", "customer_id")
      db.dropTable("orders")
    }
  );
};

exports._meta = {
  "version": 1
};