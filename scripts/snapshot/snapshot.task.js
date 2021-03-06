
module.exports = function(gulp, argv, buildConfig) {

  var snapshotConfig = require('./snapshot.config').config;
  var _ = require('lodash');
  var http = require('http');
  var connect = require('connect');
  var serveStatic = require('serve-static');
  var cp = require('child_process');
  var path = require('canonical-path');
  var uuid = require('node-uuid');

  var projectRoot = path.resolve(__dirname, '../..');
  var protractorHttpServer;
  var snapshotValues = _.merge(snapshotConfig.platformDefauls, argv);

  gulp.task('protractor-server', function() {
    var app = connect().use(serveStatic(projectRoot));  // serve everything that is static
    protractorHttpServer = http.createServer(app).listen(buildConfig.protractorPort);
    console.log('Serving `dist` on http://localhost:' + buildConfig.protractorPort);
  });

  gulp.task('snapshot', ['clean.build', 'protractor-server'], function(done) {
    snapshot(done);
  });

  gulp.task('snapshot-quick', ['e2e', 'protractor-server'], function(done) {
    snapshot(done, true);
  });

  gulp.task('e2e-publish', function(done) {
    var testId = uuid.v4().split('-')[0];
    e2ePublish(testId, true);
  });

  function snapshot(done, quickMode) {

    if (!snapshotConfig.accessKey || !snapshotConfig.accessKey.length) {
      console.error('Missing IONIC_SNAPSHOT_KEY environment variable');
      return done();
    }

    var testId = uuid.v4().split('-')[0];

    var protractorConfigFile = path.resolve(projectRoot, 'scripts/snapshot/protractor.config.js');

    snapshotValues.params.test_id = testId;
    snapshotValues.params.upload = !quickMode;

    var protractorArgs = [
      '--browser <%= browser %>',
      '--platform <%= platform %>',
      '--params.platform_id=<%= params.platform_id %>',
      '--params.platform_index=<%= params.platform_index %>',
      '--params.platform_count=<%= params.platform_count %>',
      '--params.width=<%= params.width %>',
      '--params.height=<%= params.height %>',
      '--params.test_id=<%= params.test_id %>',
      '--params.upload=<%= params.upload %>',
    ].map(function(argument) {
      return _.template(argument, snapshotValues);
    });

    e2ePublish(testId, false);

    return protractor(done, [protractorConfigFile].concat(protractorArgs));
  }

  function protractor(done, args) {
    var child = cp.spawn('protractor', args, {
      stdio: [process.stdin, process.stdout, 'pipe']
    });

    var finish = _.once(function(err) {
      err && done(err) || done();
      protractorHttpServer.close();
    });

    child.stderr.on('data', function(data) {
      finish('Protractor tests failed. Error:', data.toString());
    });
    child.on('exit', function() {
      finish();
    });
  }

  function e2ePublish(testId, verbose) {
    console.log('e2ePublish: ' + testId);
    snapshotConfig.testId = testId;
    snapshotConfig.verbose = verbose;
    require('../e2e/e2e-publish')(snapshotConfig);
  }

};
