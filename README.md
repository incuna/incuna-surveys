# incuna-surveys
Allows the creation of custom questionnaires and surveys via the admin.

# Usage

## Frontend

To set the `apiRoot` use `ProjectConfigProvider.setApiRoot()`

## Backend

### Admin

Create an `admin.py` with the following content:

```python
from django.contrib import admin
from surveys.base_admin import (
    SurveyAdmin,
    SurveyFieldAdmin,
    SurveyFieldOrderingAdmin,
    SurveyFieldsetAdmin,
    SurveyFieldsetOrderingAdmin,
    UserResponseAdmin,
)
from surveys.models import (
    Survey,
    SurveyField,
    SurveyFieldOrdering,
    SurveyFieldset,
    SurveyFieldsetOrdering,
    UserResponse,
)

admin.site.register(models.SurveyField, SurveyFieldAdmin)
admin.site.register(models.SurveyFieldset, SurveyFieldsetAdmin)
admin.site.register(models.Survey, SurveyAdmin)
admin.site.register(models.SurveyFieldOrdering, SurveyFieldOrderingAdmin)
admin.site.register(models.SurveyFieldsetOrdering, SurveyFieldsetOrderingAdmin)
admin.site.register(models.UserResponse, UserResponseAdmin)
```

Please follow the instructions for adding languages to the projects using the parler documentation
parler: https://github.com/django-parler/django-parler

# Development

## Frontend

All frontend is located under `web/`:

* `npm install` to install requirements
* `bower install` to install dependencies
* `grunt test` to test if everything is working properly
* `grunt` will start a dev server running under `localhost:9000`.

This project uses `babel` and `browserify`. Source files are located in `web/app/scripts/src`. Compiled files are put into `web/dist`, which is symlinked to `web/app/scripts/js-build` for easy testing in the browser.

### Tests

The are two `grunt karma` targets:
* `grunt karma:dev` once run will continue to watch the compiled `.js` files directory and the test files.
* `grunt karma:ci` target only runs once. This target is also used in Travis

## Releasing a new version

1. Commit your changes.
1. Follow the guidelines at http://semver.org/ to determine your new version number.
1. Update `CHANGELOG.md` with your new version number and a description of changes.
1. Update the `version` property in `package.json`
1. Update the `version` property in `setup.py`
1. Commit those changes with the commit message "Bump to [version number]". [version number] should be in the format x.y.z.
1. `git tag [version number]`
1. `git push`
1. `git push --tags` - must be done separately.
1. Run `make release` to publish the release to pypi
