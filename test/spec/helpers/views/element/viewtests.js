var commonViewTests = function(scenario, viewType, scenarioData) {

  describe('(elementview tests) ' + scenario, function() {

    var data, ViewType;

    beforeEach(function() {
      ViewType = viewType;
      data = new ViewType.Model(JSON.parse(JSON.stringify(scenarioData)));
    });

    it('the DOM element will have the same tag as defined in the data model', function() {
      var view = new ViewType(data);
      expect(view.innerEl.tagName.toUpperCase()).toBe(data.attributes.tag.toUpperCase());
      expect(view.outerEl.tagName.toUpperCase()).toBe(data.attributes.tag.toUpperCase());
    });

    it('will add a _ljView property to the DOM element', function() {
      var view = new ViewType(data);
      var element = view.innerEl;
      expect(element._ljView === view).toBeTruthy();
    });

    it('when initialized with the noRender option true, the view doesn\'t get rendered', function() {
      var view = new ViewType(data, {
        noRender: true
      });

      expect(view.outerEl).toBeDefined();
      expect(view.outerEl.id).toBe('');
    });

    it('can be initialized with an existing element, without re-rendering', function() {
      var element = document.createElement('div');
      element.id = '1000';

      var view = new ViewType(data, {
        el: element
      });
      expect(view.outerEl).toBe(element);
      expect(view.outerEl.id).not.toBe(data.attributes.id);
    });


    it('will not automatic render the DOM element with data from it\'s dataModel', function() {
      var view = new ViewType(data);
      var element = view.outerEl;

      expect(element.id).not.toBe(data.attributes.id);
    });


    it('can be initialized with an existing element, forcing re-rendering', function() {
      var element = document.createElement('div');
      element.id = '1000';
      var view = new ViewType(data, {
        el: element,
        forceRender: true
      });
      expect(view.outerEl).toBe(element);
      expect(view.outerEl.id).toBe('1000');
    });

    it('cannot add view to existing element if that is already connected to another view', function() {
      var element = document.createElement('div');
      element.id = '1000';
      element._ljView = {};
      var options = {
        el: element
      };

      var fun = function() {
        var cv = new ViewType(data, options);
      };
      expect(fun).toThrow()
    });

    it('is styled in a separte stylesheet if a style is defined', function() {
      var view = new ViewType(data);

      var expected = expect(document.getElementById('wl-obj-css').innerHTML);
      if (data.attributes.style) {
        expected.toContain("#wl-obj-" + data.attributes.id + "{" + data.attributes.style + "}");
      } else {
        expected.not.toContain("#wl-obj-" + data.attributes.id);
      }
    });

    it('will add a data-lj-id attribute DOM element', function() {
      var view = new ViewType(data);

      var element = view.outerEl;
      var data_wl_id = element.getAttribute('data-lj-id');
      expect(data_wl_id).toBe(data.attributes.id.toString());
    });

    it('will add a data-lj-type attribute DOM element', function() {
      var view = new ViewType(data);

      var element = view.outerEl;
      var data_wl_type = element.getAttribute('data-lj-type');
      expect(data_wl_type).toBe(data.attributes.type.toString());
    });

    it('will add a default class to the DOM element', function() {
      var view = new ViewType(data);

      var element = view.outerEl;
      var classAttribute = element.getAttribute('class');
      expect(classAttribute).toContain('object-default object-' + data.attributes.type);
    });

    it('will add classes that are defined in a data to the DOM element', function() {
      var view = new ViewType(data);

      var element = view.outerEl;
      var classAttribute = element.getAttribute('class');
      expect(classAttribute).toContain(data.attributes.classes);
    });

    it('will add classes that are defined in a data to the DOM element', function() {
      var view = new ViewType(data);

      var element = view.outerEl;
      var classAttribute = element.getAttribute('class');
      expect(classAttribute).toContain(data.attributes.classes);
    });

    it('will remove the linked DOM element from is parent when destroy is called', function() {
      var parent = document.createElement('div');
      var child = document.createElement('div');
      parent.appendChild(child);

      expect(parent.children.length).toBe(1);

      var view = new ViewType(data, {
        el: child
      });
      view.destroy();

      expect(parent.children.length).toBe(0);
      expect(child.parent).toBeUndefined();
    });

    it('will set the href attribute of the anchor DOM element to the link_to attribute of the data model', function() {
      var view = new ViewType(data);
      var element = view.outerEl;

      if (data.attributes.tag.toUpperCase() == 'A') {
        expect(element.hasAttribute('href')).toBeTruthy();
        expect(element.getAttribute('href')).toBe(data.attributes.linkTo ? data.attributes.linkTo : '');
      } else {
        expect(element.hasAttribute('href')).toBeFalsy();
      }
    });

    it('will set the target attribute of the anchor DOM element to the link_target attribute of the data model', function() {
      var view = new ViewType(data);
      var element = view.outerEl;

      if (data.attributes.tag.toUpperCase() == 'A') {
        expect(element.hasAttribute('target')).toBeTruthy();
        expect(element.getAttribute('target')).toBe(data.attributes.linkTarget ? data.attributes.linkTarget : '_self');
      } else {
        expect(element.hasAttribute('target')).toBeFalsy();
      }
    });

    it('listens for changes on its DOM element', function(done) {
      var view = new ViewType(data);
      var element = view.outerEl;
      view.render();

      expect(view._observer).toBeDefined();
      expect(view._observer.isObserving()).toBe(true);
      view._observer.stop();
      view._observer.options.timeout = 50;
      view._observer.observe();

      element.style.width = "55px";
      element.className = "a_class";
      element.setAttribute('data-lj-custom', 10);

      setTimeout(function(){
      expect(data.attributes.width).toBe('55px');
      expect(data.attributes.classes).toBe('a_class');
      expect(data.attributes.custom).toBe('10');
      done();
    }, 101);
    });

    it('doesn\'t listen for changes on its DOM element when disableObserver is called', function() {
      var view = new ViewType(data);
      var element = view.outerEl;

      view.render();
      view.disableObserver();

      expect(view._observer).toBeDefined();
      expect(view._observer.isObserving()).toBe(false);

      element.style.width = "55px";
      element.className = "a_class";
      element.setAttribute('data-lj-custom', 10);

      expect(data.attributes.width).not.toBe('55px');
      expect(data.attributes.classes).not.toBe('a_class');
      expect(data.attributes.custom).not.toBe('10');
    });

    it('will listen for changes on its DOM element by default', function() {
      var view = new ViewType(data);
      var element = view.outerEl;

      expect(view._observer).toBeDefined();
      expect(view._observer.isObserving()).toBe(true);
    });

    it('will put the htmlAttributes from the dataObject into the DOM element as attributes', function() {
      data.attributes.htmlAttributes.id = 'id';
      data.attributes.htmlAttributes.custom = 'custom';
      data.attributes.htmlAttributes.someThing = 'someThing';

      var view = new ViewType(data);
      var element = view.outerEl;

      expect(element.hasAttribute('id')).toBeTruthy();
      expect(element.getAttribute('id')).toBe(data.attributes.htmlAttributes.id);

      expect(element.hasAttribute('custom')).toBeTruthy();
      expect(element.getAttribute('custom')).toBe(data.attributes.htmlAttributes.custom);

      expect(element.hasAttribute('some-thing')).toBeTruthy();
      expect(element.getAttribute('some-thing')).toBe(data.attributes.htmlAttributes.someThing);
    });

    it('will not put htmlAttributes.style from the dataObject into the DOM element as attributes', function() {
      data.attributes.htmlAttributes.style = "something";

      var view = new ViewType(data);
      var element = view.outerEl;

      expect(element.hasAttribute('style')).toBeFalsy();
    });
  });
};

module.exports = commonViewTests;
