describe('HashRouter', function() {

  var HashRouter = require('../../../src/framework/router/hashRouter.js');
  var utilities = require('../helpers/utilities.js');
  var StageView = require('../../../src/framework/stageview.js')
  var state = require('../../../src/framework/state.js');

  var hashRouter;

  beforeEach(function() {
    hashRouter = new HashRouter();
  });

  it('can handle a hashed url', function(done) {
    var url = window.location.href + '#stage1.layer1.frame2';

    var html = "<div data-lj-type='stage' id='stage1'>" +
      "<div data-lj-type='layer' id='layer1' data-lj-default-frame='frame1'>" +
      "<div data-lj-type='frame' id='frame1' data-lj-name='frame1'></div>" +
      "<div data-lj-type='frame' id='frame2' data-lj-name='frame2'></div>" +
      "</div>" +
      "</div>";

    utilities.setHtml(html);

    new StageView(null, {
      el: document.getElementById('stage1')
    });

    var promise = hashRouter.handle(url, {});

    promise.then(function(result) {
      setTimeout(function() {
        expect(result.handled).toBeTruthy();
        expect(result.stop).toBeTruthy();
        var layerView = document.getElementById('layer1')._ljView;
        expect(layerView.currentFrame.data.attributes.name).toBe('frame2');
        done();
      }, 500);
    });
  });

  it('can only handle an url with a hash', function(done) {
    var promise = hashRouter.handle('http://localhost/', {});

    promise.then(function(result) {
      expect(result.handled).toBeFalsy();
      done();
    });
  });

  it('can only handle an url with a hash that is the same as the current url', function(done) {
    var promise = hashRouter.handle('http://localhost/test.html#stage1.layer1.frame2', {});

    promise.then(function(result) {
      expect(result.handled).toBeFalsy();
      done();
    });
  });

});
