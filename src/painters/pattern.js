Blinken = require('../blinken');

PatternPainter = function(layer) {
  var pattern = layer.get("pattern");
  var step = (layer.container && layer.container.step) || 0;
  step = Math.round(step * (layer.get("speed") || 1));

  layer.paintEach(function(i, pixel) {
    return pattern[Math.abs(i + step) % pattern.length];
  });
}

module.exports = PatternPainter;
