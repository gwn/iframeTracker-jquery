/**
 * jQuery iframe click tracking plugin
 *
 * @author Vincent Paré (www.finalclap.com)
 * @copyright © 2013-2015 Vincent Paré
 * @license http://opensource.org/licenses/Apache-2.0
 * @version 1.1.0
 *
 * @edited and simplified by Ege Avunç for the needs of
 * my own analytics tracking library
 */

// Tracking handler manager
$.fn.iframeTracker = function(handler){
  $.iframeTracker.track(this.get(), handler);
};

// Iframe tracker common object
$.iframeTracker = {
  // State
  focusRetriever: null,  // Element used for restoring focus on window (element)
  focusRetrieved: false, // Says if the focus was retrived on the current page (bool)
  handlersList: [],      // Store a list of every trakers (created by calling $(selector).iframeTracker...)
  
  // Init (called once on document ready)
  init: function(){
    // Listening window blur
    $(window).focus();
    $(window).blur(function(e){
      $.iframeTracker.windowLoseFocus(e);
    });
    
    // Focus retriever (get the focus back to the page, on mouse move)
    $('body').append('<div style="position:fixed; top:0; left:0; overflow:hidden;"><input style="position:absolute; left:-300px;" type="text" value="" id="focus_retriever" readonly="true" /></div>');
    this.focusRetriever = $('#focus_retriever');
    this.focusRetrieved = false;
    $(document).mousemove(function(e){
      if (document.activeElement && document.activeElement.tagName == 'IFRAME') {
        $.iframeTracker.focusRetriever.focus();
        $.iframeTracker.focusRetrieved = true;
      }
    });
  },
  
  
  // Add tracker to target using handler (bind boundary listener + register handler)
  // target: Array of target elements (native DOM elements)
  // handler: User handler object
  track: function(target, handler){
    // Adding target elements references into handler
    handler.target = target;
    
    // Storing the new handler into handler list
    $.iframeTracker.handlersList.push(handler);

    // Binding boundary listener
    $(target)
      .bind('mouseover', {handler: handler}, $.iframeTracker.mouseoverListener)
      .bind('mouseout',  {handler: handler}, $.iframeTracker.mouseoutListener);
  },

  // Target mouseover event listener
  mouseoverListener: function(e) {
    e.data.handler.over = true;
  },
  
  // Target mouseout event listener
  mouseoutListener: function(e) {
    e.data.handler.over = false;
    $.iframeTracker.focusRetriever.focus();
  },
  
  // Calls blurCallback for every handler with over=true on window blur
  windowLoseFocus: function(event) {
    for (var i in this.handlersList) {
      if (this.handlersList[i].over == true) {
        try {this.handlersList[i]();} catch(ex) {}
      }
    }
  }
};

// Init the iframeTracker on document ready
$(function() {
  $.iframeTracker.init();
});
