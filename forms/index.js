// import in caolan forms
const forms = require( "forms" );
// create some shortcuts
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

// help to format forms to use CSS classes
var bootstrapField = function ( name, object ) {
    if ( !Array.isArray( object.widget.classes ) ) {
        object.widget.classes = [];
    }

    if ( object.widget.classes.indexOf( 'form-control' ) === -1 ) {
        object.widget.classes.push( 'form-control' );
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if ( validationclass ) {
        object.widget.classes.push( validationclass );
    }

    var label = object.labelHTML( name );
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML( name, object );
    return '<div class="form-group">' + label + widget + error + '</div>';
};

// Define a form to add books
const createBookForm = ( formats, genres, publishers, tags, authors ) => {
    return forms.create( {
        title: fields.string( {
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: [ 'form-label mt-3' ]
            },
        } ),
        authors: fields.string( {
            label: "Author(s)",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: [ "form-label mt-3" ]
            },
            widget: widgets.multipleSelect(),
            choices: authors
        } ),
        publishedDate: fields.date( {
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: [ 'form-label mt-3' ]
            },
            validators: [ validators.date() ],
            widget: widgets.date()
        } ),
        stock: fields.number( {
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: [ "form-label mt-3" ],
            },
            validators: [ validators.integer() ]
        } ),
        cost: fields.number( {
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: [ 'form-label mt-3' ]
            },
        } ),
        description: fields.string( {
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: [ 'form-label mt-3' ]
            }
        } ),
        format_id: fields.string( {
            label: "Format",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: [ "form-label mt-3" ]
            },
            widget: widgets.select(),
            choices: formats
        } ),
        genre_id: fields.string( {
            label: "Genre",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: [ "form-label mt-3" ]
            },
            widget: widgets.select(),
            choices: genres
        } ),
        publisher_id: fields.string( {
            label: "Publisher",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: [ "form-label mt-3" ]
            },
            widget: widgets.select(),
            choices: publishers
        } ),
        tags: fields.string( {
            label: "Tag(s)",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: [ "form-label mt-3" ]
            },
            widget: widgets.multipleSelect(),
            choices: tags
        } ),
        imageUrl: fields.url( {
            errorAfterField: true,
            cssClasses: {
                label: [ 'form-label mt-3' ]
            },
            widget: widgets.hidden(),
            validators: [ validators.url() ],
        } )
    } )
};

const registerUserForm = ( roles ) => {
    return forms.create( {
        username: fields.string( {
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: [ "form-label mt-3" ],
            },
        } ),
        email: fields.string( {
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: [ "form-label mt-3" ],
            },
        } ),
        password: fields.password( {
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: [ "form-label mt-3" ],
            },
        } ),
        confirm_password: fields.password( {
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: [ "form-label mt-3" ],
            },
            validators: [ validators.matchField( "password" ) ],
        } ),
        role_id: fields.password( {
            label: "Role",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: [ "form-label mt-3" ],
            },
            widget: widgets.select(),
            choices: roles
        } )
    } );
}

const createUpdateUserForm = () => {
    return forms.create( {
        username: fields.string( {
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: [ "form-label mt-3" ],
            },
        } ),
        email: fields.string( {
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: [ "form-label mt-3" ],
            },
        } ),
        old_password: fields.password( {
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: [ "form-label mt-3" ],
            },
        } ),
        new_password: fields.password( {
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: [ "form-label mt-3" ],
            },
        } ),
        new_confirm_password: fields.password( {
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: [ "form-label mt-3" ],
            },
            validators: [ validators.matchField( "new_password" ) ],
        } ),
    } )
}

const createLoginForm = () => {
    return forms.create( {
        email: fields.string( {
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: [ "form-label mt-3" ],
            },
        } ),
        password: fields.password( {
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: [ "form-label mt-3" ],
            },
        } ),
    } )
}

const createAuthorForm = () => {
    return forms.create( {
        name: fields.string( {
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: [ "form-label" ]
            }
        } )
    } )
}

const createPublisherForm = () => {
    return forms.create( {
        name: fields.string( {
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: [ "form-label mt-3" ]
            }
        } )
    } )
}

const createGenreForm = () => {
    return forms.create( {
        name: fields.string( {
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: [ "form-label mt-3" ]
            }
        } )
    } )
}

const createTagForm = () => {
    return forms.create( {
        name: fields.string( {
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: [ "form-label mt-3" ]
            }
        } )
    } )
}




module.exports = {
    createBookForm,
    bootstrapField,
    registerUserForm,
    createLoginForm,
    createAuthorForm,
    createPublisherForm,
    createGenreForm,
    createTagForm,
    createUpdateUserForm
}