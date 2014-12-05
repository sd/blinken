Blinken = require('../blinken');

OversampledPatternPainter = function(layer) {
  var oversample = 4;
  var pattern = layer.get("pattern");
  var step = (layer.container && layer.container.step) || 0;
  step = Math.round(step * (layer.get("speed") || 1));

  var stretchedPattern = new Array(pattern.length * oversample);
  for (var i = 0; i < pattern.length; i++) {
    for (var j = 0; j < oversample; j++) {
      stretchedPattern[i * oversample + j] = pattern[i];
    }
  }

  var r, g, b, pixel;
  layer.paintEach(function(i, pixel) {
    r = 0; g = 0; b = 0;
    for (var j = 0; j < oversample; j++) {
      pixelRGB = stretchedPattern[Math.abs(i * oversample + j + step) % stretchedPattern.length];

      r += (pixelRGB & 0xFF0000) >> 16;
      g += (pixelRGB & 0x00FF00) >> 8;
      b += (pixelRGB & 0x0000FF);
    }
    return ((r / oversample) << 16) | ((g / oversample) << 8) | ((b / oversample));
  });
}

module.exports = OversampledPatternPainter;
