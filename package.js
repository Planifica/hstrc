Package.describe({
    name: 'planifica:hstrc',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: 'Adds history logging to your collections',
    // URL to the Git repository containing the source code for this package.
    git: 'https://github.com/Planifica/hstrc'
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    //documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.0.3.1');
    api.use('matb33:collection-hooks@0.7.13');
    api.use('mongo');
    api.addFiles('planifica:hstrc.js');
});

Package.onTest(function(api) {
    api.use('tinytest');
    api.use('planifica:hstrc');
    api.addFiles('planifica:hstrc-tests.js');
});
