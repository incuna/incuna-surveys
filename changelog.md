# Changelog for incuna-surveys

This project uses Semantic Versioning (2.0).

### 0.15.4

* Remove search for proportion slider h4 during the initialisation

### 0.15.3

* Fix a bug where answers could not have commas in them

### 0.15.2

* bugfix: Prevent calculate percentage directive setting percentageComplete to infinity.
* bugfix: Update proportion field display text.

### 0.15.1

* Fix proportion field for rzSlider

## 0.15.0

* Change proportion field to a slider group

## 0.14.0

* The response create serializer will now correctly return the instance created

### 0.13.1

* Exclude `test_project` and web folders from distribution.

### 0.13.0

* Added translation to the following model fields:
    - Survey
        - name
        - description        
    - SurveyField
        - name
        - help_text
        - answers
    - SurveyFieldset
        - name
        - description

### 0.12.0

* Add missing translate
* Hide submit button until form is set

### 0.11.0
* bugfix: Remove getForm() api method and dry with api.get
* bugfix: Avoid fatal error when api promise fails but there are no errors
* Compile templates with swig.
* Add proportion / field.
* Handle blank and invalid integers.
* Set up base templates that can be extended locally so blocks can be overwritten
* Modify proportion templates for styling

### 0.10.0
* Amend percentage calculation to include value of 0
* Amend HTML structure of calculate-percentage to provide class and wrapper

### 0.9.0
* Allow null responses to survey fields.

### 0.8.0
* New feature: Calculate and display the survey completion percentage.

### 0.7.0
* Add classes to radio.html for styling
* BUGFIX: Fix serializer to cope with response data that does not match the form.

### 0.6.1
* BUGFIX: add missing hyphen in `drf-form-field` in radio.html

### 0.6.0
* Add a wrapper template to wrap field groups with a separate header and body

### 0.5.0
  * Add ordered m2m accessors for Survey.get_ordered_fieldsets() SurveyFieldset.get_ordered_fields().

### 0.4.0
* Add `not-empty` class to field wrapper, for styling purposes.
* Add classes to fieldset header
* Remove field-id from checkbox and slider template

### 0.3.0
* Add surveys-form directive on-success and on-failure callbacks

### 0.2.1
* Add default `sort_order` ordering to Orderable models.
* Add admin fields and filtering.
* Escape twig templates.
* Ensure field ids are unique across fieldsets.

### 0.2.0
* Rename `admin.py` to `base_admin.py`.

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

