# incuna-surveys
Allows the creation of custom questionnaires and surveys via the admin.

# Development

## Frontend

All frontend is located under `web/`. Run `npm install` to install requirements, `grunt test` to test if everything is working properly. Running `grunt` will start a dev server running under `localhost:9000`.

This project uses `babel` and `browserify`. Source files are located in `web/app/scripts/src`. Compiled files are put into `web/dist`. This folder is symlinked to `web/app/scripts/js-build` for easy testing in the browser.
