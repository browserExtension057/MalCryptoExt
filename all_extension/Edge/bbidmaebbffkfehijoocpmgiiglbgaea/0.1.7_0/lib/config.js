var config = {};

config.welcome = {
  set lastupdate (val) {app.storage.write("lastupdate", val)},
  get lastupdate () {return app.storage.read("lastupdate") !== undefined ? app.storage.read("lastupdate") : 0}
};

config.addon = {
  "top": {},
  "badge": {},
  set log (val) {app.storage.write("log", val)},
  set active (val) {app.storage.write("active", val)},
  get log () {return app.storage.read("log") !== undefined ? app.storage.read("log") : false},
  get active () {return app.storage.read("active") !== undefined ? app.storage.read("active") : true},
  "filter": {
    set list (val) {app.storage.write("filter-list", val)},
    get list () {return app.storage.read("filter-list") !== undefined ? app.storage.read("filter-list") : {}}
  }
};

config.filter = {
  "load": function (callback) {
    var request = new XMLHttpRequest();
    request.open("GET", "../filter/filter.json");
    request.onload = function () {
      try {
        var response = JSON.parse(request.responseText);
        if (response) callback(response);
      } catch (e) {}
    };
    /*  */
    request.send();
  }
};

config.hostname = function (url) {
  url = url.replace("www.", '');
  var s = url.indexOf("//") + 2;
  if (s > 1) {
    var o = url.indexOf('/', s);
    if (o > 0) return url.substring(s, o);
    else {
      o = url.indexOf('?', s);
      if (o > 0) return url.substring(s, o);
      else return url.substring(s);
    }
  } else return url;
};

config.get = function (name) {
  return name.split('.').reduce(function (p, c) {return p[c]}, config);
};

config.set = function (name, value) {
  function set(name, value, scope) {
    name = name.split('.');
    if (name.length > 1) {
      set.call((scope || this)[name.shift()], name.join('.'), value);
    } else this[name[0]] = value;
  }
  /*  */
  set(name, value, config);
};
