Color = require('color');

var Blinken = (function() {
  function Blinken() {

  }
  Blinken.prototype = {

  }
  return Blinken;
})();

Blinken.Lights = (function() {
  function lights(length, options) {
    this.length = length;
    this.step = 0;
    this.options = options || {};

    this.layers = [];

    this.params = this.options.params || {};
  }

  lights.prototype = {
    get: function(name) {
      if (this.params[name]) {
        return this.params[name];
      }
      else if (this.container) {
        return this.container.get(name);
      }
    },

    set: function(name, value) {
      this.params[name] = value;
    },


    dump: function() {
      var str = "";
      this.layers.forEach(function(layer) {
        str += "Name: " + layer.name + "\n";
        str += layer.dump() + "\n";
        str += "-----------------------------------------\n";
      })
      return str;
    },

    flatten: function() {
      var pixels = new Array();
      var white = Color("#FFF");

      for (var i = 0; i < this.length; i++) {
        var pixel = white.clone();
        this.layers.forEach(function(layer) {
          pixel = Blinken.Color.combine(pixel, layer.pixels[i])
        })
        pixels[i] = pixel;
      }

      return pixels;
    },

    newLayer: function(options) {
      var layer = new Blinken.Layer(this.length, options);
      layer.container = this;

      this.layers.push(layer);
      return layer;
    },

    paintAll: function(options) {
      this.step = this.step || 0;

      this.layers.forEach(function(layer) {
        if (layer.painter) {
          layer.painter(layer);
        }
      })
      this.step = this.step + 1;
    }
  }
  return lights;
})();

Blinken.Layer = (function() {
  function layer(length, options) {
    this.length = length;
    this.options = options || {};
    this.name = options.name || "Unnamed Layer";
    this.params = options.params || {};

    this.pixels = new Array();
    if (options.fill) {
      this.fill(options.fill);
    }
    else {
      this.fill(Color("#FF0000"));
    }

    this.painter = options.painter;
  }
  layer.prototype = {
    get: function(name) {
      if (this.params[name]) {
        return this.params[name];
      }
      else if (this.container) {
        return this.container.get(name);
      }
    },

    set: function(name, value) {
      this.params[name] = value;
    },

    fill: function(color) {
      for (var i = 0; i < this.length; i++) {
        this.pixels[i] = color.clone();
      }
    },

    paintEach: function(painterFunction) {
      for (var i = 0; i < this.length; i++) {
        var pixel = painterFunction(i, this.pixels[i]);
        this.pixels[i] = pixel.clone();
      }
    },

    dump: function() {
      return this.pixels.map(function(x) {return x.hexString()}).join("  ");
    }
  }
  return layer;
})();

Blinken.Color = {
  combine: function(bg, fg) {
    var bgRGB = bg.rgbArray();
    var bgAlpha = bg.alpha();
    var fgRGB = fg.rgbArray();
    var fgAlpha = fg.alpha();

    var alpha = 1 - (1 - fgAlpha) * (1 - bgAlpha);
    var fgWeight = fgAlpha / alpha;
    var bgWeight = bgAlpha * (1 - fgAlpha) / alpha;

    var red   = fgRGB[0] * fgWeight + bgRGB[0] * bgWeight;
    var green = fgRGB[1] * fgWeight + bgRGB[1] * bgWeight;
    var blue  = fgRGB[2] * fgWeight + bgRGB[2] * bgWeight;
    return Color().rgb(red, green, blue);
  }
}

Blinken.Painter = {}

Blinken.Painter.Pattern = require('./painters/pattern')
Blinken.Painter.Zebra = require('./painters/zebra')
Blinken.Painter.Sparkles = require('./painters/sparkles')


module.exports = Blinken;