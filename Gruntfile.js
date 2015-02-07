/* jshint node:true */
module.exports = function(grunt) {
	var path = require('path');

	// Load tasks.
	require('matchdep').filterDev('grunt-*').forEach( grunt.loadNpmTasks );

	// Project configuration.
	grunt.initConfig({
		sass: {
			dev: {
				options: {
					style: 'expanded',
					noCache: false,
					sourcemap: false
				},
				expand: true,
				cwd: 'scss/',
				dest: 'css/',
				ext: '.css',
				src: [ 'style.scss' ]
			}
		},

		autoprefixer: {
			options: {},
			dev: {
				src: [ 'css/style.css' ]
			}
		},

		concat: {
			dev: {
				src: [ 'js/src/template.js', 'js/src/fb.js', 'js/src/meetup.js', 'js/src/a11y.js', 'js/src/google.js' ],
				dest: 'js/main.js',
			}
		},

		watch: {
			css: {
				files: ['scss/**'],
				tasks: ['sass:dev','autoprefixer:dev']
			},
			js: {
				files: ['js/src/**'],
				tasks: ['concat:dev']
			}
		}
	});

	// Register tasks.

	// Build task.
	grunt.registerTask('dev',     ['sass:dev', 'autoprefixer:dev', 'concat:dev']);

	// Default task.
	grunt.registerTask('default', ['dev']);

};
