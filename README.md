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

Usage
====================

This app depends on the use of `front matter` which is text prepended to templates like so:

````
---
name: mail
url: /mail
---
````

Front matter follows YAML conventions. For dynamic routing, a `name` and `url` have to be used (as discussed above). There are some other options.

###Parent
`parent` to specify a parent template. This can also be done using standard dot-delimited convention in the name. So you can either do this:

````
----
name: inbox
parent: mail
----
````

or this:

````
----
name: mail.inbox
----
````

Note that this specifies `child` templates. This means that when `mail` loads up, it'll have to have a `<div ui-view></div>` element into which a child is loaded. A child will need a `url` as well but note that the URL will be appended to the parent's URL like so:

````
name: mail
url: /mail
````

will be accessible via `/mail` while the child:

````
name: mail.inbox
url: /inbox
````

will be accessible via `/mail/inbox`. This specific URL has to be typed in in order for the child to show up. This allows us to specify several children (`inbox`, `sent`, `trash`, etc.).

###Composed views

Child views are great and all but what if you want to COMPOSE a view. Let's say you want a template that includes a dynamic sidebar and a footer. You can't create that with a child template structure. 

For the main view (the parent) that will house the rest of the templates in a composition add this:

````
name: mail
composed: true
````

This willl tell the system to look out for any composable views. Now let's look at what the footer would look like:

````
name: footer
hasComposed: true
parent: mail
````

Note that for composable views, you can't use dot-delimited parents, you have to explicitly set them! To use the footer in the original `mail` template, you have to use its name:

`<div ui-view="footer"></div>`

And it will show up

###Controllers
Angular supports this neat thing called controllers. They can get confusing and so each template gets its own `DefaultController` which can be overriden like so:

````
controller: MyController
````

Among other things, the default controller passes a bunch of data through. For instance, all of your front-matter settings will be accessible via `vars` in your template. `{{ vars.name }}` will return the name of your route while `{{ vars.path }}` will return the relative path to the template.

If you use dynamic parameters in your URL, those parameters will be accessible via `params` so if your URL is:

````
url: /mail/inbox/:id
````

It will match any URL that follows that pattern (so `/mail/inbox/383828` would match as well as `/mail/inbox/my-email` but not `/mail/inbox/3838/something`).

###Additional mock data

Now that we have views and controllers out of the way, let's talk about mock data. As I've said, the controller will pass on ALL front matter to the template/view which means that we can add miscellaneous data to the front-matter and access it in the view! The front matter plugin supports standard YAML conventions which means that even arrays are supported! Let's see how we can put this to good use.

Let's say that we want to create a list of emails. Instead of copy/pasting a ton of code to simulate a full inbox, we can create a front-matter array:

````
emails:
    - Email 1
    - Email 2
    - Email 3
    - Email 4
    - Email 5
    - Email 6
````

We can then iterate over this array using standard angular conventions:

````
<div ng-repeat="email in vars.emails">{{ email }}</div>
````
