(function($) {
  $.actualizers = [];
  $.fn.actualizer = function(target, callback) {
    target = $(target);
    var $fn = $(this);
    $.actualizer.cancel($fn);
    if(!$.isFunction(callback)) {
      callback = function(element, xhr) {
        return true;
      };
    };
    if(target.filter('a').length==target.length) {
      $.actualizers[$fn] = target;
      target.click(function(event) {
        var caller = $(this);
        $fn.load($(this)[0].href, {}, function(response, server, xhr) { $fn.trigger('actualize'); callback($fn, caller, xhr);});
        event.preventDefault();
        return false;
      });
      return $fn;
    };
    if(target.children('a').length==target.children().length) {
      var targets = target.children();
      $.actualizers[$fn] = targets;
      targets.click(function(event) {
        var caller = $(this);
        $fn.load($(this)[0].href, {}, function(response, server, xhr) { $fn.trigger('actualize'); callback($fn, caller, xhr);});
        event.preventDefault();
        return false;
      });
      return $fn;
    };
    if(target.eq(0).is('form')) {
      target = target.eq(0);
      $.actualizers[$fn] = target;
      var method = { meth: target.attr('method') };
      var getMethod = { meth: "get" };
      var meth = $.extend(method, getMethod).meth;
      if(target.attr('action')) {
        var act = target.attr('action');
      }
      else {
        var act = window.location.href;
      };
      if(meth=="get") {
        act+= "?";
        target.find(':input[name]').each(function() {
          act+= $(this).attr('name') + "=" + $(this).val() + "&";
        });
        target.submit(function(event) {
          var caller = $(this);
          $fn.load(act, {}, function(response, server, xhr) { $fn.trigger('actualize'); callback($fn, caller, xhr);});
          event.preventDefault();
          return false;
        });
      }
      else {
        var postData = {};
        target.find(':input[name]').each(function() {
          var inputName = $(this).attr('name');
          postData[inputName] = $(this).val();
        });
        target.submit(function(event) {
          var caller = $(this);
          $fn.post(act, postData, function(data, status, xhr) {
            callback($fn, caller, xhr);
            $fn.trigger('actualize');
            $fn.html(data);
          });
          event.preventDefault();
          return false;
        });
      };
    };
  }
  $.actualizer = {
    cancel: function(target) {
      target = $(target);
      if($.actualizers[target]) {
        var link = $.actualizers[target];
        if(link.attr('href')) {
          var href = "thisHref";
        }
        else {
          if(link.attr('action'))
            var href = link.attr('action');
          else
            var href = window.location.href;
        };
        link.off('click');
        $.actualizers[target] = false;
      };
      return $.actualizer;
    }
  }
})(jQuery);
