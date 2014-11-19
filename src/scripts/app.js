'use strict';

var $           = require('jquery'),
    _           = require('lodash/dist/lodash.compat'),
    behaviors   = require('./app/behaviors'),
    bootstrap   = require('bootstrap'),
    fastclick   = require('fastclick');

// Fastclick
fastclick(document.body);

// Behaviors
behaviors.init();