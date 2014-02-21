/*
 * jQuery Utilities
 */

(function($){
  
  var types = {
    element: 1,
    text: 3,
    comment: 8,
    document: 9
  };
  
  $.fn.splitText = function(offset) {
    return $(this.splitText(offset));
  };
  
  $.fn.data = function(data) {
	  if(data) {
		  this.data = data;
	  }
    return this.data;
  };
  
  $.fn.tageName = function() {
    return this.tagName;
  };
  
  $.fn.nodetype = function() {
    return this.nodeType;
  };
  
  $.fn.filterNodeType = function( type ) {
    var type = typeof type === "string" ? types[ type.toLowerCase() ] : type;
    
    return this.pushStack( this.filter(function(){
      return this.nodeType === type;
    }), "nodetype", type );
  };
  
})(jQuery);