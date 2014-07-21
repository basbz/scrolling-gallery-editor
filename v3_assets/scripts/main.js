require.config({
  paths: {
    'v3': '/v3_assets/bower_components/v3-manager-alpha/scripts',
    'vb-core': '/v3_assets/bower_components/viewbook-core-js-lib/src',
    ramda: '/v3_assets/bower_components/ramda/ramda',
    rsvp: '/v3_assets/bower_components/rsvp/rsvp.amd',
    jquery: '/v3_assets/bower_components/jquery/dist/jquery',
    react: '/v3_assets/bower_components/react/react'
  }
});

define([
  'jquery',
  'ramda',
  'v3/core/main',
  'v3/core/dispatch',
  'v3/editor/store',
  'v3/modules/scrolling-gallery/store'
], function ($, R, Core, Dispatch, Editor, ScrollingGallery) {
  function trace (log, msg) {
    log('%cV3 Dispatched %c' + msg, 'background-color:#2ECC71; color:#fff; padding:3px .5em 4px',  'color:#2ECC71; padding-left:.5em;');
  }

  var trace_msg = R.lPartial(trace, window.console && window.console.log ? console.log.bind(console) : function () {});

  Dispatch.onDispatched(function (action) {
    return trace_msg(action.type);
  });

  Editor.init(parent.document);
  Core.start();
  ScrollingGallery.main();

  //var page_id = parent.VBMiddlePagesView.currentWebPageID;

  require(['v3/modules/scrolling-gallery/actions'], function (actions) {
    parent.scrollingGallery = R.mapObj(function (x) {
      return x;
    }, actions.default);

    actions.default.showSettingsPanel();
  });
});

