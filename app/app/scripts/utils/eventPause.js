var EventPause = function() {
	var self = this;
	var events = ['click', 'keydown', 'keyup', 'scroll', 'hover', 'mouseout', 'mousein','mouseover'];
	var nullFun=function(){};

	var getIndex = function(array,value){
		for(var i=0; i<	array.length; i++){
			if(array[i]==value){
				return i;
			}
		}
		return -1;	
	};

	this.pauseEvent = function(elm,eventAry){
		var events = $._data(elm, "events");
		if (events) {
			$.each(events, function(type, definition) {
				if((getIndex(eventAry,type)!=-1)||(eventAry=='')){
				$.each(definition, function(index, event) {
					if (event.handler.toString() != nullFun.toString()){
						if(!$._iwEventPause) $._iwEventPause = {};

						$._iwEventPause["iw-event" + event.guid] = event.handler;
						event.handler = nullFun;
					}
				})
				}
			})
		}
	};

	this.activeEvent = function(elm,eventAry){
		var events = $._data(elm, "events");
		if (events) {
			$.each(events, function(type, definition) {
				if((getIndex(eventAry,type)!=-1)||(eventAry=='')){
				$.each(definition, function(index, event) {
					if (event.handler.toString() == nullFun.toString()){
						event.handler = $._iwEventPause["iw-event" + event.guid];
					}
				})
				}
			})
		}
	};

	this.disableAll = function(el) {
		el = el || $('*');
		el.each(function() {
			self.pauseEvent($(this)[0], events);
		});
	};
	
	this.enableAll = function(el) {
		el = el || $('*');
		el.each(function() {
			self.activeEvent($(this)[0], events);
		});
	};
	
	return this;	
};


$.eventManager = new EventPause();