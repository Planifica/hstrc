var HstrcCollection;

HstrcCollection = (function() {
    function HstrcCollection() {}

    HstrcCollection._collection = new Mongo.Collection('hstry');

    HstrcCollection._addHooks = function(collection, options) {
        var defaultOptions;
        defaultOptions = {
            log: {
                insert: true,
                update: true,
                remove: true
            },
            fields: null,
            omitFields: '_id'
        };

        options = _.extend(defaultOptions, options);
        if ((options.fields !== null) && (options.omitFields !== null)) {
            throw new Error("[HstrcCollection] you can either specify fields or omitFields, not both!");
        }

        return ['insert', 'update', 'remove'].forEach(function(type) {
            if (!options.log[type]) {
                return;
            }
            return collection.after[type](function(userId, doc) {
                var state,
                    currentDocumentHistory = HstrcCollection._collection.find({collection: collection._name, documentId: doc._id});

                state = {
                    type: type,
                    collection: collection._name,
                    documentId: doc._id,
                    userId: userId,
                    date: new Date(),
                    seqNumber: currentDocumentHistory.count()
                };
                switch (type) {
                    case 'insert':
                        state.doc = {};
                        break;
                    case 'update':
                        state.doc = this.previous;
                        break;
                    case 'remove':
                        state.doc = doc;
                }
                return HstrcCollection._createState(options, state);
            });
        });
    };

    HstrcCollection._createState = function(options, state) {

        if (options && options.fields) {
            state.doc = _.pick(state.doc, options.fields);
        }
        if (options && options.omitFields) {
            state.doc = _.omit(state.doc, options.omitFields);
        }

        return HstrcCollection._collection.insert(state);
    };

    return HstrcCollection;

})();

if (Mongo !== "undefined" && Mongo !== null) {
    Mongo.Collection.prototype.logHistory = function(options) {
        if (Meteor.isServer) {
            return HstrcCollection._addHooks(this, options);
        }
    };
} else {
    Meteor.Collection.prototype.logHistory = function(options) {
        if (Meteor.isServer) {
            return HstrcCollection._addHooks(this, options);
        }
    };
}
