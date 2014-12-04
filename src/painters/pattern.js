Blinken = require('../blinken');

PatternPainter = function(layer) {
  var pattern = layer.get("pattern");
  var step = (layer.container && layer.container.step) || 0;

  layer.paintEach(function(i, pixel) {
    return pattern[(i + step) % pattern.length];
  });
}

module.exports = PatternPainter;
