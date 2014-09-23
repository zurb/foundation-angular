Foundation Angular
==================

Installation
=================

**Step 1** `git clone git@github.com:zurb/foundation-angular.git`

**Step 2** `cd` into the directory

**Step 3** `npm install && bower install`

**Step 4** `gulp`

**Step 5** Open [localhost:3000](http://localhost:3000)

Features
==================

Gulp will watch for file changes in the `client` directory. Upon change, all files will be copied over to the `build` directory and the webserver will be reloaded.

Dynamic Routing
===================

To simplify the routing process, this project includes dynamic routing. Here's how it works:

1. Add front matter to an application template (in `client/templates`)
2. Make sure to include a `name` which you'd want to use with `ui-sref` (the ui-router way of linking pages) and a `url` which that template can be accessible through
3. Run `gulp` to compile the project into the `build` folder


