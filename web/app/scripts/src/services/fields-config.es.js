const FieldsConfig = function (formly) {
    return {
        templatesBase: 'templates/incuna-surveys/fields'
    };
};

module.run(function (formlyConfig, FieldsConfig) {
    const templatesBase = FieldsConfig.templatesBase;

    formlyConfig.setType({
        name: 'free_text',
        templateUrl: `${templatesBase}/free-text.html`
    });

    formlyConfig.setType({
        name: 'number',
        templateUrl: `${templatesBase}/number.html`
    });

    formlyConfig.setType({
        name: 'percentage',
        templateUrl: `${templatesBase}/percentage.html`
    });

    formlyConfig.setType({
        name: 'checkbox',
        templateUrl: `${templatesBase}/checkbox.html`
    });

    formlyConfig.setType({
        name: 'radio',
        templateUrl: `${templatesBase}/radio.html`
    });

});
