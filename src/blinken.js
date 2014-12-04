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
      var white = 0xFFFFFF;

      for (var i = 0; i < this.length; i++) {
        var pixel = white;
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

    this.pixels = new Array(length);
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
      if (typeof color.rgbNumber == "function")
        color = color.rgbNumber;

      for (var i = 0; i < this.length; i++) {
        this.pixels[i] = color;
      }
    },

    paintEach: function(painterFunction) {
      for (var i = 0; i < this.length; i++) {
        this.pixels[i] = painterFunction(i, this.pixels[i]);
      }
    },

    dump: function() {
      return this.pixels.map(function(x) {return x.toString(16)}).join("  ");
    }
  }
  return layer;
})();

Blinken.Color = {
  combine: function(bg, fg) {
    if (fg == null)
      return bg;
    if (bg == null)
      return fg;

    var fgAlpha = 1; //((fg & 0xFF000000) >> 24);

    if (fgAlpha == 0)
      return fg;

    var fgRGB = [
      (fg & 0xFF0000) >> 16,
      (fg & 0x00FF00) >> 8,
      (fg & 0x0000FF)
    ];

    var bgAlpha = 1; //((bg & 0xFF000000) >> 24);
    var bgRGB = [
      (bg & 0xFF0000) >> 16,
      (bg & 0x00FF00) >> 8,
      (bg & 0x0000FF)
    ];


    var alpha = 1 - (1 - fgAlpha) * (1 - bgAlpha);
    var fgWeight = fgAlpha / alpha;
    var bgWeight = bgAlpha * (1 - fgAlpha) / alpha;

    var red   = fgRGB[0] * fgWeight + bgRGB[0] * bgWeight;
    var green = fgRGB[1] * fgWeight + bgRGB[1] * bgWeight;
    var blue  = fgRGB[2] * fgWeight + bgRGB[2] * bgWeight;
    return (alpha << 24) | (red << 16) | (green << 8) | (blue);
  },

  toCSSHex: function(argb) {
    return "#" + ("00000000" + (argb & 0xFFFFFF).toString(16)).slice(-6);
  }
}

Blinken.Painter = {}

Blinken.Painter.Pattern = require('./painters/pattern')
Blinken.Painter.Zebra = require('./painters/zebra')
Blinken.Painter.Sparkles = require('./painters/sparkles')


module.exports = Blinken;