'use strict';

var behaviors   = require('./app/behaviors'),
    bootstrap   = require('bootstrap'),
    fastclick   = require('fastclick');

// Fastclick
fastclick(document.body);

// Behaviors
behaviors.init();