const chromeLauncher = require('chrome-launcher')
const delay = require('delay')
const prompt = require('prompt-promise')

let signalingServers

module.exports = (grunt) => {

  require('load-grunt-tasks')(grunt)

  grunt.initConfig({
    eslint: {
      target: ['ts/**/*.ts']
    },
    watch: {
      files: [
        'Gruntfile.js',
        'package.json',
        'tsconfig.json',
        '.eslintrc.js',
        'ts/**/*.ts',
        'test/**/*',
        '!test/e2e/browser/index.js'
      ],
      tasks: ['build'],
      options: {
        spawn: false,
        interrupt: true
      }
    },
    clean: ['node', 'browser'],
    mkdir: {
      node: {
        options: {
          create: ['node']
        },
      },
      browser: {
        options: {
          create: ['browser']
        },
      },
    },
    ts: {
      default : {
        tsconfig: './tsconfig.json',
        options: {
          fast: 'never'
        }
      }
    },
    run: {
      'npm-test': {
        cmd: 'npm',
        args: ['test']
      },
      browserify: {
        cmd: 'npm',
        args: ['run', 'browserify']
      },
      'browserify-hashcash-worker': {
        cmd: 'npm',
        args: ['run', 'browserify-hashcash-worker']
      },
      'browserify-test': {
        cmd: 'npm',
        args: ['run', 'browserify-test']
      },
    }
  })

  grunt.loadNpmTasks(
    'grunt-contrib-watch',
    'grunt-contrib-clean',
    'grunt-mkdir',
    'grunt-ts',
    'grunt-run',
    'grunt-force-task'
  )

  grunt.registerTask('default', ['build', 'watch'])

  grunt.registerTask('build', [
    'test-cleanup',
    'clean',
    'mkdir',
    'eslint',
    'ts',
    'run:browserify',
    'run:browserify-hashcash-worker',
    'run:browserify-test',
    'test'
  ])

  grunt.registerTask('test', [
    'test-cleanup',
    'servers',
    'test-browser',
    'run:npm-test',
  ])

  grunt.registerTask('test-browser', 'open browser test in chrome', async function() {
    const done = this.async()
    const chrome = await chromeLauncher.launch({
      startingUrl: 'http://localhost:8080/test/e2e/browser',
      chromeFlags: ['--args', '--incognito']
    })

    const response = await prompt('browser test succeeded? (y/n): ')
    await chrome.kill()
    
    if (response == 'y') {
      done()
    } else {
      done(false)
    }

  })

  grunt.registerTask('test-cleanup', 'cleanup previous test', async function() {
    const done = this.async()

    if (signalingServers) {
      signalingServers.forEach((signalingServer) => {
        signalingServer.destroy()
      })
    }

    done()

  })

  grunt.registerTask('servers', 'start test servers', async function() {

    const done = this.async()

    const params = require('./test/e2e/node/params')
    const SignalingServer = require('./node/classes/SignalingServer').SignalingServer
    signalingServers = params.signalingServerPorts.map((port) => {
      console.log(`start server ${port}`)
      return new SignalingServer(port)
    })

    await delay(1000)

    done()
  })

}
