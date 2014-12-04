Blinken = require('../blinken');

OversamplingPatternPainter = function(layer) {
  var oversample = 4;
  var pattern = layer.get("pattern");
  var step = (layer.container && layer.container.step) || 0;

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
      pixelRGB = stretchedPattern[(i * oversample + j + step) % stretchedPattern.length];

      r += (pixelRGB & 0xFF0000) >> 16;
      g += (pixelRGB & 0x00FF00) >> 8;
      b += (pixelRGB & 0x0000FF);
    }
    return ((r / oversample) << 16) | ((g / oversample) << 8) | ((b / oversample));
  });
}

module.exports = OversamplingPatternPainter;

/*

Pattern:   1 2 3 4 1 2 3 4
           | | | | | | | |
Pixels:    1 2 3 4 1 2 3 4

Oversampling:  1111222233334444
               \  /\  /\  /\  /
Pixels:          1   2   3   4

Oversampling:  4111122223333444
               \  /\  /\  /\  /
Pixels:        1~4 2~1 3~2 4~1

 */