// Generated by CoffeeScript 1.3.1
(function() {
  var Euphony,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Euphony = (function() {

    Euphony.name = 'Euphony';

    function Euphony() {
      this.setCurrentTime = __bind(this.setCurrentTime, this);

      this.pause = __bind(this.pause, this);

      this.stop = __bind(this.stop, this);

      this.resume = __bind(this.resume, this);

      this.start = __bind(this.start, this);

      this.play = __bind(this.play, this);

      var _this = this;
      this.design = new PianoKeyboardDesign();
      this.keyboard = new PianoKeyboard(this.design);
      this.rain = new NoteRain(this.design);
      this.player = MIDI.Player;
      this.player.addListener(function(data) {
        var NOTE_OFF, NOTE_ON, message, note;
        NOTE_OFF = 128;
        NOTE_ON = 144;
        note = data.note, message = data.message;
        if (message === NOTE_ON) {
          return _this.keyboard.press(note);
        } else if (message === NOTE_OFF) {
          return _this.keyboard.release(note);
        }
      });
      this.player.setAnimation({
        delay: 20,
        callback: function(data) {
          var end, now;
          now = data.now, end = data.end;
          if (typeof _this.onprogress === "function") {
            _this.onprogress(now / end);
          }
          return _this.rain.update(now * 1000);
        }
      });
    }

    Euphony.prototype.initScene = function() {
      var _this = this;
      this.scene = new Scene('#canvas');
      this.scene.add(this.keyboard.model);
      this.scene.add(this.rain.model);
      return this.scene.animate(function() {
        return _this.keyboard.update();
      });
    };

    Euphony.prototype.initMidi = function(callback) {
      return MIDI.loadPlugin(callback);
    };

    Euphony.prototype.getBuiltinMidiIndex = function(callback) {
      var _this = this;
      if (this.midiIndex) {
        return callback(this.midiIndex);
      }
      return $.getJSON('tracks/index.json', function(index) {
        _this.midiIndex = index;
        return callback(_this.midiIndex);
      });
    };

    Euphony.prototype.setBuiltinMidi = function(filename, callback) {
      var _this = this;
      if (typeof localStorage !== "undefined" && localStorage !== null ? localStorage[filename] : void 0) {
        return this.setMidiFile(localStorage[filename], callback);
      }
      return $.ajax({
        url: "tracks/" + filename,
        dataType: 'text',
        success: function(data) {
          _this.setMidiFile(data, callback);
          return typeof localStorage !== "undefined" && localStorage !== null ? localStorage[filename] = data : void 0;
        }
      });
    };

    Euphony.prototype.setMidiFile = function(midiFile, callback) {
      var _this = this;
      return this.player.loadFile(midiFile, function() {
        return _this.rain.setMidiData(_this.player.data, callback);
      });
    };

    Euphony.prototype.play = function() {
      if (this.started) {
        return this.resume();
      } else {
        return this.start();
      }
    };

    Euphony.prototype.start = function() {
      return this.player.start();
    };

    Euphony.prototype.resume = function() {
      this.player.currentTime += 1e-6;
      return this.player.resume();
    };

    Euphony.prototype.stop = function() {
      return this.player.stop();
    };

    Euphony.prototype.pause = function() {
      return this.player.pause();
    };

    Euphony.prototype.setCurrentTime = function(currentTime) {
      this.player.pause();
      this.player.currentTime = currentTime;
      return this.player.resume();
    };

    Euphony.prototype.on = function(eventName, callback) {
      return this["on" + eventName] = callback;
    };

    return Euphony;

  })();

  this.Euphony = Euphony;

}).call(this);
