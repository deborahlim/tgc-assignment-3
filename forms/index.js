// import in caolan forms
const forms = require("forms");
// create some shortcuts
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

// help to format forms to use CSS classes
var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) {
        object.widget.classes = [];
    }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

// Define a form to add books
const createBookForm = (formats, genres, publishers, tags, authors) => {
    return forms.create({
        title: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label mt-3']
            },
        }),
        authors: fields.string({
            label: "Author(s)",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"]
            },
            widget: widgets.multipleSelect(),
            choices: authors,
        }),
        publishedDate: fields.date({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label mt-3']
            },
            validators: [validators.date()],
            widget: widgets.date()
        }),
        stock: fields.number({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"],
            },
            validators: [validators.integer()]
        }),
        cost: fields.number({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label mt-3']
            },
            validators: [validators.range(0.01, 1000.00)],
        }),
        description: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label mt-3']
            },
            validators: [validators.maxlength(300)],
        }),
        format_id: fields.string({
            label: "Format",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"]
            },
            widget: widgets.select(),
            choices: formats,
        }),
        genre_id: fields.string({
            label: "Genre",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"]
            },
            widget: widgets.select(),
            choices: genres,
        }),
        publisher_id: fields.string({
            label: "Publisher",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"]
            },
            widget: widgets.select(),
            choices: publishers,
        }),
        tags: fields.string({
            label: "Tag(s)",
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"]
            },
            widget: widgets.multipleSelect(),
            choices: tags,
            validators: [],
        }),
        imageUrl: fields.url({
            errorAfterField: true,
            required: true,
            cssClasses: {
                label: ['form-label mt-3']
            },
            widget: widgets.hidden(),
            validators: [validators.url()],
        })
    }, {
        validatePastFirstError: true
    })
};

// Define a search form to search books
const createSearchBooksForm = (formats, genres, publishers, tags, authors) => {
    return forms.create({
        title: fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label mt-3']
            },
        }),
        authors: fields.string({
            label: "Author(s)",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"]
            },
            widget: widgets.multipleSelect(),
            choices: authors
        }),
        publishedDateFrom: fields.date({
            label: "Published Date Range",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label mt-3']
            },
            validators: [validators.date()],
            widget: widgets.date()
        }),
        publishedDateTo: fields.date({
            label: "to",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label mb-0 fw-normal']
            },
            validators: [validators.date()],
            widget: widgets.date()
        }),
        min_cost: fields.number({
            label: "Price Range (S$)",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label mt-3']
            },
            validators: [validators.regexp(/^[0-9]*(\.[0-9]{0,2})?$/, "Enter a positive number up to 2 decimal places")]
        }),
        max_cost: fields.number({
            label: "to",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label mb-0 fw-normal'],
            },
            validators: [validators.regexp(/^[0-9]*(\.[0-9]{0,2})?$/, "Enter a positive number up to 2 decimal places")]
        }),
        format_id: fields.string({
            label: "Format",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"]
            },
            widget: widgets.select(),
            choices: formats
        }),
        genre_id: fields.string({
            label: "Genre",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"]
            },
            widget: widgets.select(),
            choices: genres
        }),
        publisher_id: fields.string({
            label: "Publisher",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"]
            },
            widget: widgets.select(),
            choices: publishers
        }),
        tags: fields.string({
            label: "Tag(s)",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"]
            },
            widget: widgets.multipleSelect(),
            choices: tags
        })
    }, {
        validatePastFirstError: true
    })
};

const createAuthorSearchForm = () => {
    return forms.create({
        name: fields.string({
            required: false,
            label: "    ",
            cssClasses: {
                label: ["control-label"],
            }
        })
    })
}

const registerUserForm = (roles) => {
    return forms.create({
        username: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"],
            },
            validators: [validators.rangelength(4, 12)]
        }),
        email: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"],
            },
            validators: [validators.email()]
        }),
        password: fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"],
            },
            validators: [validators.minlength(7), validators.alphanumeric()]
        }),
        confirm_password: fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"],
            },
            validators: [validators.matchField("password")],
        }),
        role_id: fields.password({
            label: "Role",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"],
            },
            widget: widgets.select(),
            choices: roles
        })
    }, {
        validatePastFirstError: true
    });
}

const createUpdateUserAccountForm = () => {
    return forms.create({
        username: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"],
            },
            validators: [validators.rangelength(4, 12)]
        }),
        email: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"],
            },
            validators: [validators.email()]
        }),
        old_password: fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"],
            },
        }),
        new_password: fields.password({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"],
            },
            validators: [validators.minlength(7), validators.alphanumeric()]
        }),
        new_confirm_password: fields.password({
            label: "Confirm New Password",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"],
            },
            validators: [validators.matchField("new_password")],
        }),
    }, {
        validatePastFirstError: true
    })
}

const createUpdateUserForm = (roles) => {
    return forms.create({
        username: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"],
            },
            validators: [validators.rangelength(4, 12)]
        }),
        email: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"],
            },
            validators: [validators.email()]
        }),

        new_password: fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"],
            },
            validators: [validators.minlength(7), validators.alphanumeric()]
        }),
        new_confirm_password: fields.password({
            label: "Confirm New Password",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"],
            },
            validators: [validators.matchField("new_password")],
        }),
        role_id: fields.password({
            label: "Role",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"],
            },
            widget: widgets.select(),
            choices: roles
        })

    }, {
        validatePastFirstError: true
    })
}

const createLoginForm = () => {
    return forms.create({
        email: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"],
            },
            validators: [validators.email()]
        }),
        password: fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"],
            },
        }),
    }, {
        validatePastFirstError: true
    })
}

const createAuthorForm = () => {
    return forms.create({
        name: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"]
            }
        })
    })
}

const createPublisherForm = () => {
    return forms.create({
        name: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"]
            }
        })
    })
}

const createGenreForm = () => {
    return forms.create({
        name: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"]
            }
        })
    })
}

const createTagForm = () => {
    return forms.create({
        name: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"]
            }
        })
    })
}

const createUpdateOrderStatusForm = (statuses) => {
    return forms.create({
        status: fields.string({
            label: "Status",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"]
            },
            widget: widgets.select(),
            choices: statuses,
        }),
    })
}

const createSearchOrdersForm = (statuses) => {
    return forms.create({
        id: fields.string({
            label: "Order ID",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label mt-3']
            },
        }),
        customer_id: fields.string({
            label: "Customer ID",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label mt-3']
            },
        }),
        customerUsername: fields.string({
            label: "Customer Username",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label mt-3']
            },
        }),
        createdDateFrom: fields.date({
            label: "Created Date Range",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label mt-3']
            },
            validators: [validators.date()],
            widget: widgets.date()
        }),
        createdDateTo: fields.date({
            label: "to",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label mb-0 fw-normal']
            },
            validators: [validators.date()],
            widget: widgets.date()
        }),
        order_status_id: fields.number({
            label: "Order Status",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-3"]
            },
            widget: widgets.select(),
            choices: statuses
        }),
        minAmount: fields.number({
            label: "Amount Range (S$)",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label mt-3']
            },
            validators: [validators.regexp(/^[0-9]*(\.[0-9]{0,2})?$/, "Enter a positive number up to 2 decimal places")]
        }),
        maxAmount: fields.number({
            label: "to",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label mb-0 fw-normal'],
            },
            validators: [validators.regexp(/^[0-9]*(\.[0-9]{0,2})?$/, "Enter a positive number up to 2 decimal places")]
        }),
    }, {
        validatePastFirstError: true
    })
};


module.exports = {
    createBookForm,
    bootstrapField,
    registerUserForm,
    createLoginForm,
    createAuthorForm,
    createPublisherForm,
    createGenreForm,
    createTagForm,
    createUpdateUserForm,
    createUpdateUserAccountForm,
    createSearchBooksForm,
    createAuthorSearchForm,
    createUpdateOrderStatusForm,
    createSearchOrdersForm
}