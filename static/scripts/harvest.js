// Generated by CoffeeScript 1.4.0
(function() {
  var canvas, ctx, onError, onSuccess, opencvCoord2CanvasCoord, saveLabel, startHarvest, update, video, ws;

  onError = function(e) {
    return console.log("Rejected", e);
  };

  onSuccess = function(localMediaStream) {
    video.src = webkitURL.createObjectURL(localMediaStream);
    return setInterval(update, 250);
  };

  update = function() {
    ctx.drawImage(video, 0, 0, 320, 240);
    return canvas.toBlob(function(blob) {
      return ws.send(blob);
    }, 'image/jpeg');
  };

  video = document.querySelector('video');

  canvas = document.querySelector('canvas');

  ctx = canvas.getContext('2d');

  ctx.strokeStyle = '#ff0';

  ctx.lineWidth = 2;

  opencvCoord2CanvasCoord = function(openCvPoints) {
    return [openCvPoints[0], openCvPoints[1], openCvPoints[2] - openCvPoints[0], openCvPoints[3] - openCvPoints[1]];
  };

  ws = new WebSocket("ws://" + location.host + "/harvesting");

  ws.onopen = function() {
    return console.log("Opened websocket");
  };

  ws.onmessage = function(e) {
    var canvasCoords, openCvCoords;
    openCvCoords = JSON.parse(e.data)[0];
    canvasCoords = opencvCoord2CanvasCoord(openCvCoords);
    return ctx.strokeRect(canvasCoords[0], canvasCoords[1], canvasCoords[2], canvasCoords[3]);
  };

  saveLabel = function(label) {
    return $.post('/harvest', {
      label: label
    }).success(function() {
      return startHarvest();
    });
  };

  startHarvest = function() {
    $('form').hide();
    return navigator.webkitGetUserMedia({
      'video': true,
      'audio': false
    }, onSuccess, onError);
  };

  $('button').click(function(e) {
    var label;
    e.preventDefault();
    label = $('#name').val();
    if (label) {
      return saveLabel(label);
    }
  });

}).call(this);
