describe('Start Positions', function() {
  var utilities = require('../helpers/utilities.js');

  beforeEach(function() {
    // window size can be set
    browser.driver.manage().window().setSize(800, 600);
  });

  describe('with native-scrolling=true', function() {

    describe('with fit-to=height', function() {

      it('start-position=center', function() {
        browser.get('startpositions/nativescrolling_true/fitto_height/startposition_center.html').then(function() {
          protractor.promise.all([
            utilities.getBoundingClientRect('layer'),
            utilities.getBoundingClientRect('frame'),
            utilities.getScroll('layer')
          ]).then(function(data) {
            var layer_dimensions = data[0];
            var frame_dimensions = data[1];
            var layer_scroll = data[2];

            expect(layer_scroll.scrollLeft).toBe((frame_dimensions.width - layer_dimensions.width) / 2);
          });
        });
      });

      it('start-position=left', function() {
        browser.get('startpositions/nativescrolling_true/fitto_height/startposition_left.html').then(function() {
          protractor.promise.all([
            utilities.getScroll('layer')
          ]).then(function(data) {
            var layer_scroll = data[0];

            expect(layer_scroll.scrollLeft).toBe(0);
          });
        });
      });

      it('start-position=right', function() {
        browser.get('startpositions/nativescrolling_true/fitto_height/startposition_right.html').then(function() {
          protractor.promise.all([
            utilities.getBoundingClientRect('layer'),
            utilities.getBoundingClientRect('frame'),
            utilities.getScroll('layer')
          ]).then(function(data) {
            var layer_dimensions = data[0];
            var frame_dimensions = data[1];
            var layer_scroll = data[2];

            expect(layer_scroll.scrollLeft).toBe((frame_dimensions.width - layer_dimensions.width));
          });
        });
      });
    });

    describe('with fit-to=width', function() {

      it('start-position=bottom', function() {
        browser.get('startpositions/nativescrolling_true/fitto_width/startposition_bottom.html').then(function() {
          protractor.promise.all([
            utilities.getBoundingClientRect('layer'),
            utilities.getBoundingClientRect('frame'),
            utilities.getScroll('layer')
          ]).then(function(data) {
            var layer_dimensions = data[0];
            var frame_dimensions = data[1];
            var layer_scroll = data[2];

            expect(layer_scroll.scrollTop).toBe(frame_dimensions.height - layer_dimensions.height);
          });
        });

      });

      it('start-position=center', function() {
        browser.get('startpositions/nativescrolling_true/fitto_width/startposition_center.html').then(function() {
          protractor.promise.all([
            utilities.getBoundingClientRect('layer'),
            utilities.getBoundingClientRect('frame'),
            utilities.getScroll('layer')
          ]).then(function(data) {
            var layer_dimensions = data[0];
            var frame_dimensions = data[1];
            var layer_scroll = data[2];

            expect(layer_scroll.scrollTop).toBe((frame_dimensions.height - layer_dimensions.height) / 2);
          });
        });
      });

      it('start-position=top', function() {
        browser.get('startpositions/nativescrolling_true/fitto_width/startposition_top.html').then(function() {
          protractor.promise.all([
            utilities.getScroll('layer')
          ]).then(function(data) {
            var layer_scroll = data[0];

            expect(layer_scroll.scrollTop).toBe(0);
          });
        });
      });
    });
  });


  describe('with native-scrolling=false', function() {

    describe('with fit-to=height', function() {

      it('start-position=center', function() {
        browser.get('startpositions/nativescrolling_false/fitto_height/startposition_center.html').then(function() {
          protractor.promise.all([
            utilities.getBoundingClientRect('stage'),
            utilities.getBoundingClientRect('frame')
          ]).then(function(data) {
            var stage_dimensions = data[0];
            var frame_dimensions = data[1];

            expect(frame_dimensions.left).toBe((stage_dimensions.width - frame_dimensions.width) / 2);
          });
        });
      });

      it('start-position=left', function() {
        browser.get('startpositions/nativescrolling_false/fitto_height/startposition_left.html').then(function() {
          protractor.promise.all([
            utilities.getBoundingClientRect('frame')
          ]).then(function(data) {
            var frame_dimensions = data[0];

            expect(frame_dimensions.left).toBe(0);
          });
        });
      });

      it('start-position=right', function() {
        browser.get('startpositions/nativescrolling_false/fitto_height/startposition_right.html').then(function() {
          protractor.promise.all([
            utilities.getBoundingClientRect('stage'),
            utilities.getBoundingClientRect('frame')
          ]).then(function(data) {
            var stage_dimensions = data[0];
            var frame_dimensions = data[1];
            
            expect(frame_dimensions.left).toBe((stage_dimensions.width - frame_dimensions.width));
          });
        });
      });
    });

    describe('with fit-to=width', function() {

      it('start-position=bottom', function() {
        browser.get('startpositions/nativescrolling_false/fitto_width/startposition_bottom.html').then(function() {
          protractor.promise.all([
            utilities.getBoundingClientRect('stage'),
            utilities.getBoundingClientRect('frame')
          ]).then(function(data) {
            var stage_dimensions = data[0];
            var frame_dimensions = data[1];

            expect(frame_dimensions.top).toBe(stage_dimensions.height - frame_dimensions.height);
          });
        });

      });

      it('start-position=center', function() {
        browser.get('startpositions/nativescrolling_false/fitto_width/startposition_center.html').then(function() {
          protractor.promise.all([
            utilities.getBoundingClientRect('stage'),
            utilities.getBoundingClientRect('frame')
          ]).then(function(data) {
            var stage_dimensions = data[0];
            var frame_dimensions = data[1];

            expect(frame_dimensions.top).toBe((stage_dimensions.height - frame_dimensions.height) / 2);
          });
        });
      });

      it('start-position=top', function() {
        browser.get('startpositions/nativescrolling_false/fitto_width/startposition_top.html').then(function() {
          protractor.promise.all([
            utilities.getBoundingClientRect('frame')
          ]).then(function(data) {
            var frame_dimensions = data[0];

            expect(frame_dimensions.top).toBe(0);
          });
        });
      });
    });
  });

});
