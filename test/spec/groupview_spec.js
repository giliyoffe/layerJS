var GroupView =  require('../../src/framework/groupview.js');

var ViewsGroupViewTests = require('./helpers/views/group/viewtests.js');
var ViewsCommonParseTests = require('./helpers/views/common/parsetests.js');
var ViewsCommonViewTests = require('./helpers/views/common/viewtests.js');
var ViewsGroup_parseChildrenTests = require('./helpers/views/group/_parseChildrentests.js');
var ViewsGroup_renderchildpositiontests = require('./helpers/views/group/_renderchildpositiontests.js');
var utilities = require('./helpers/utilities.js');
var ViewsCommonIdentifyTests = require('./helpers/views/common/identifytests.js');

describe("GroupView", function() {

  var repository;
  var ElementView;

  beforeEach(function() {
    repository = require('../../src/framework/repository.js');
    ElementView = require('../../src/framework/elementview.js');
  });

  ViewsCommonViewTests('simple_groupdata.js', function() {
    return {
      data: require('./datasets/simple_groupdata.js')[0],
      ViewType: GroupView
    };
  });

  ViewsCommonViewTests('anchor_groupdata.js', function() {
    return {
      data: require('./datasets/anchor_groupdata.js')[0],
      ViewType: GroupView
    };
  });

  ViewsGroupViewTests('groupdata_with_elementdata.js', function() {
    return {
      data: require('./datasets/groupdata_with_elementdata.js'),
      ViewType: GroupView,
      parentId: 110530
    };
  });

  ViewsGroup_renderchildpositiontests('groupdata_with_elementdata.js', function() {
    return {
      data: require('./datasets/groupdata_with_elementdata.js'),
      ViewType: GroupView,
      parentId: 110530
    };
  });

  it("when a view that is attached using the attachView method changes, the _myChildListenerCallback should be called", function() {
    var groupData = new GroupView.Model(JSON.parse(JSON.stringify(require('./datasets/simple_groupdata.js')[0])));
    var groupView = new GroupView(groupData);

    expect(groupView._myChildListenerCallback).toBeDefined();
    spyOn(groupView, '_myChildListenerCallback');

    var objData = new ElementView.Model(JSON.parse(JSON.stringify(require('./datasets/simple_elementdata.js')[0])));
    var elementView = new ElementView(objData);

    groupView.attachView(elementView);

    elementView.data.set('x', 20);

    expect(groupView._myChildListenerCallback.calls.count()).toBe(1);
    expect(groupView._myChildListenerCallback).toHaveBeenCalledWith(elementView.data);
  });

  it("when a view with a parent is attached using the attachView method changes, the _myChildListenerCallback should be called", function() {
    var parentData = new GroupView.Model(JSON.parse(JSON.stringify(require('./datasets/simple_groupdata.js')[0])));
    parentData.attributes.id = 123456789;
    var parentView = new GroupView(parentData);

    var objData = new ElementView.Model(JSON.parse(JSON.stringify(require('./datasets/simple_elementdata.js')[0])));
    var elementView = new ElementView(objData);

    parentView.attachView(elementView);

    var groupData = new GroupView.Model(JSON.parse(JSON.stringify(require('./datasets/simple_groupdata.js')[0])));
    var groupView = new GroupView(groupData);

    expect(groupView._myChildListenerCallback).toBeDefined();
    spyOn(groupView, '_myChildListenerCallback');

    groupView.attachView(elementView);
    expect(elementView.parent).toBe(groupView);

    elementView.data.set('x', 20);

    expect(groupView._myChildListenerCallback.calls.count()).toBe(1);
    expect(groupView._myChildListenerCallback).toHaveBeenCalledWith(elementView.data);
  });

  it("when a childview it's data changes, the _renderChildPosition should be called", function() {
    repository.clear();
    repository.importJSON(JSON.parse(JSON.stringify(require('./datasets/groupdata_with_elementdata.js'))), 'default');
    data = repository.get(110530, 'default');
    if (data.attributes.children.length > 0) {
      var parentView = new GroupView(data);
      expect(parentView._myChildListenerCallback).toBeDefined();

      var childView = parentView.getChildView(data.attributes.children[0]);
      expect(childView.parent).toBe(parentView);

      childView.data.set('x', 20);
      expect(childView.outerEl.style.left).toBe('20px');
    }
  });

  it("the order of layersjs objects will be kept correct", function() {
    var version = 'test';
    repository.clear();

    var dataObjects = [{
      "id": '100',
      "type": 'group',
      "children": ['101', '102'],
      "version": version
    }, {
      "id": '101',
      "type": "element",
      "version": version
    }, {
      "id": '102',
      "type": "element",
      "version": version
    }];

    repository.importJSON(dataObjects, version);

    utilities.setHtml("<div id='100' data-lj-id='100' data-lj-type='" + data.attributes.type + "'>" +
      "<div id='element1'></div>" +
      "<div id='101' data-lj-id='101' data-lj-type='group'></div>" +
      "<div id='element2'></div>" +
      "<div id='102' data-lj-id='102' data-lj-type='group'></div>" +
      "<div id='element3'></div>" +
      "</div>");

    var parentData = repository.get(100, version);
    var parentElement = document.getElementById('100');
    var parentView = new GroupView(parentData, {
      el: parentElement
    });

    expect(parentElement.children[0].id).toBe('element1');
    expect(parentElement.children[1].id).toBe('101');
    expect(parentElement.children[2].id).toBe('element2');
    expect(parentElement.children[3].id).toBe('102');
    expect(parentElement.children[4].id).toBe('element3');

    parentData.set('children', ['102', '101']);

    var order = {};
    for (var i = 0; i < parentElement.children.length; i++) {
      order[parentElement.children[i].id] = i;
    }
    // these tests are only topological as the reordering of the layerJS children does not uniquely define a reordering of all elements.
    expect(order['102'] < order['101']).toBe(true);
    expect(order['element1'] < order['element2']).toBe(true);
    expect(order['element2'] < order['element3']).toBe(true);
    expect(order['element1'] < order['102']).toBe(true);
    expect(order['101'] < order['element3']).toBe(true);
  });

  ViewsCommonParseTests(function() {
    return {
      ViewType: GroupView
    }
  });

  ViewsGroup_parseChildrenTests(function() {
    return {
      ViewType: GroupView,
      HTML: "<div id='100' data-lj-id='100' data-lj-type='group'>" +
        "<div id='101' data-lj-id='101' data-lj-type='group'></div>" +
        "<div id='102' data-lj-id='102' data-lj-type='group'></div>" +
        "<div></div>" +
        "</div>",
      expectedChildren: ['101', '102']
    };
  });

  it('has a static function getNodeType which is undefined par default', function() {
    expect(GroupView.getNodeType).not.toBeDefined();
  })

  describe('will identify all DOM elements with a data-lj-type="group" or without a data-lj-type attribute', function() {
    ViewsCommonIdentifyTests('div', GroupView, function() {
      return document.createElement('div');
    }, true);

    ViewsCommonIdentifyTests('div', GroupView, function() {
      var element = document.createElement('div');
      element.setAttribute('data-lj-type', 'custom');
      return element;
    }, false);

    ViewsCommonIdentifyTests('head', GroupView, function() {
      return document.createElement('head');
    }, true);

    ViewsCommonIdentifyTests('body', GroupView, function() {
      return document.createElement('body');
    }, true);

    ViewsCommonIdentifyTests('body', GroupView, function() {
      var element = document.createElement('body');
      element.setAttribute('data-lj-type', 'custom');
      return element;
    }, false);

    ViewsCommonIdentifyTests('div data-lj-type="group"', GroupView, function() {
      var element = document.createElement('div');
      element.setAttribute('data-lj-type', 'group');

      return element;
    }, true);
  });
});
