Blinken = require('../blinken');

SparklesPainter = function(layer) {
  if (!layer._sparkles) {
    layer._sparkles = [];
  }

  var transparent = null;

  var color1 = layer.get("color1") || layer.get("color");
  var freq = layer.get("frequency") || layer.get("freq");

  layer.paintEach(function(i, pixel) {
    if (Math.random() <= freq) {
      return color1;
    }
    else {
      return transparent;
    }
  });
}

module.exports = SparklesPainter;
