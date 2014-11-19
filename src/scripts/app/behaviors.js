'use strict';

var $ = require('jquery');

var myBehaviors = {
    'example': require('./behaviors/example')
};

function loadBehaviors($context) {
    if ($context === undefined) {
        $context = $(document);
    }

    $context.find('[data-behavior]').addBack('[data-behavior]').each(function() {
        var element = this,
            behaviors = element.getAttribute('data-behavior');

        $.each(behaviors.split(' '), function(index, behaviorName) {
            var behavior = myBehaviors[behaviorName];

            if (typeof(behavior) !== 'undefined') {
                behavior.init(element);
            }
        });
    });
}

var behaviors = {
    'init': function initBehaviors($context) {
        loadBehaviors($context);
    }
};

module.exports = behaviors;