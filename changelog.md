# Changelog for incuna-surveys

This project uses Semantic Versioning (2.0).

### 0.1.1
* Fix potential frontend bug using fiedset index rather than id.
* Simplify internal frontend model representation to match api survey response get.
* Fix survey-form directive import to include template.
* Move post api_description to match urls.

### 0.1.0
* Add survey list view.
* Add optional `start_date` and `end_date` for `Survey`.

### 0.0.5
* Add web API.post service to post form data to a url.
* Update web survey-form to use urls to get the form and get and post response data.
* Move user_id from the api serializer to the url.
* Add create method to the get latest endpoint.

### 0.0.4
* Add date_created to the output of latest_response() and its helpers.

### 0.0.3
* Refactor and expand UserResponseQuerySet.

### 0.0.2
* Make sure npm package only installs web folder
* Expose es5 files and make deafault entrypoint to them
* Make a wrapping directive for `formly-form`

### 0.0.1
* Initial release to test dependency install
* Add `web` folder with basic `grunt` setup
* Add frontend test setup
* Add angular dependency and json fixtures loading for frontend tests
* Add an angular service for api communication
* Use a `ProjectConfig` provider to set the `apiRoot`
* Set up the API

