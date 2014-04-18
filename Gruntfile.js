'use strict';

module.exports = function(grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	grunt.initConfig({
		hub: {
			web: {
				src: ['web/Gruntfile.js'],
				tasks: ['build']
			},
			app: {
				src: ['app/Gruntfile.js'],
				tasks: ['build']
			}
		},

		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'dist'
					]
				}]
			},
			server: '.tmp'
		},

		copy: {
			web: {
				files: [{
					expand: true,
					cwd: 'web/dist/',
					dest: 'dist/',
					src: ['**/*']
				}]
			},
			app: {
				files: [{
					expand: true,
					cwd: 'app/dist/',
					dest: 'dist/app/',
					src: ['**/*']
				}]
			}
		},

		connect: {
			options: {
				port: 9999,
				// Change this to '0.0.0.0' to access the server from outside.
				hostname: 'localhost',
				open: true,
				middleware: function(connect, options) {
					var middlewares = [];

					if (!Array.isArray(options.base)) {
						options.base = [options.base];
					}
					middlewares.push(require('grunt-connect-proxy/lib/utils').proxyRequest);

					// Serve static files
					options.base.forEach(function(base) {
						middlewares.push(connect.static(base));
					});
					return middlewares;
				}
			},
			proxies: [{
				context: '/api', // the context of the data service
				changeOrigin: true,
				host: 'hearth-net-topmonks-staging.herokuapp.com', // wherever the data service is running,
				https: false,
				port: 80 // the port that the data service is running on
			}],
			dist: {
				options: {
					base: 'dist'
				}
			}
		}
	});

	grunt.registerTask('server', function(target) {
		if (target === 'dist') {
			return grunt.task.run([
				'build',
				'configureProxies:server',
				'connect:dist:keepalive'
			]);
		}
	});

	grunt.registerTask('build', [
		'clean:dist',
		'hub:web',
		'hub:app',
		'copy:web',
		'copy:app'
	]);

};