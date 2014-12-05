Blinken = require('../blinken');
PatternPainter = require('./oversampled_pattern');

ZebraPainter = function(layer) {
  var segmentLength = layer.get("size") || 1;
  var color1 = layer.get("color1");
  var color2 = layer.get("color2");
  var pattern = new Array();
  for (var i = 0; i < segmentLength; i++)
    pattern.push(color1);
  for (var i = 0; i < segmentLength; i++)
    pattern.push(color2);
  layer.set("pattern", pattern);

  PatternPainter(layer);
}

module.exports = ZebraPainter;

