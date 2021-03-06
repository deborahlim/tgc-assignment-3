const bookshelf = require("../bookshelf")

// create a new Book model and store it in the Book object
const Book = bookshelf.model("Book", {
    // use the tableName key to set which table the model belongs to

    tableName: "books",
    genres() {
        return this.belongsTo("Genre")
    },
    formats() {
        return this.belongsTo("Format")
    },
    publishers() {
        return this.belongsTo("Publisher")
    },
    tags() {
        return this.belongsToMany("Tag");
    },
    authors() {
        return this.belongsToMany("Author")
    }

})

const Format = bookshelf.model("Format", {
    tableName: "formats",
    books() {
        return this.hasMany("Book")
    }
})

const Genre = bookshelf.model("Genre", {
    tableName: "genres",
    books() {
        return this.hasMany("Book")
    }
})

const Publisher = bookshelf.model("Publisher", {
    tableName: 'publishers',
    books() {
        return this.hasMany("Book")
    }
})

const Tag = bookshelf.model("Tag", {
    tableName: "tags",
    books() {
        return this.belongsToMany("Book")
    }
})

const Author = bookshelf.model("Author", {
    tableName: "authors",
    books() {
        return this.belongsToMany("Book")
    }
})

const User = bookshelf.model("User", {
    tableName: "users",
    roles() {
        return this.belongsTo("Role")
    }
})

const Role = bookshelf.model("Role", {
    tableName: "roles",
    users() {
        return this.hasMany("User")
    }
})

const CartItem = bookshelf.model("CartItem", {
    tableName: "cart_items",
    books() {
        return this.belongsTo("Book")
    },
    customers() {
        return this.belongsTo("Customer")
    }


})

const Customer = bookshelf.model("Customer", {
    tableName: "customers",
    orders() {
        return this.hasMany("Order")
    }
})

const Order = bookshelf.model("Orders", {
    tableName: "orders",
    customers() {
        return this.belongsTo("Customer")
    },
    orderItems() {
        return this.hasMany("OrderItem")
    },
    orderStatuses() {
        return this.belongsTo("OrderStatus")
    }
})

const OrderItem = bookshelf.model("OrderItem", {
    tableName: "order_items",
    books() {
        return this.belongsTo("Book")
    },
    orders() {
        return this.belongsTo("Order")
    }
})

const BlacklistedToken = bookshelf.model('BlacklistedToken', {
    tableName: 'blacklisted_tokens'
})

const OrderStatus = bookshelf.model("OrderStatus", {
    tableName: "order_statuses",
    books() {
        return this.hasMany("Book")
    },


})


module.exports = {
    Book,
    Format,
    Genre,
    Publisher,
    Tag,
    Author,
    User,
    Role,
    CartItem,
    Customer,
    Order,
    OrderItem,
    BlacklistedToken,
    OrderStatus
}