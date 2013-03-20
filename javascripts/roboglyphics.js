(function() {
  var BassClef, Clef, Fantasy, Giraffes, Leonardo, Loopy, MODE, Madman, Pen, Roboglyph, Roboglypics, Stacatto, Vec, modes, rand, randAngle,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  randAngle = function() {
    return Math.random() * Math.PI * 2;
  };

  rand = function() {
    return (Math.random() - 0.5) * 2;
  };

  Vec = (function() {

    function Vec(x, y) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
    }

    Vec.prototype.add = function(o) {
      this.x += o.x;
      return this.y += o.y;
    };

    return Vec;

  })();

  Pen = (function() {

    function Pen(canvas) {
      this.canvas = canvas;
      this.initDefaults();
      if (typeof this.onSetup === "function") {
        this.onSetup();
      }
      this.resetPoint();
    }

    Pen.prototype.initDefaults = function() {
      this.scale = 1;
      this.age = 0;
      this.angle = 0;
      this.dAngle = 0;
      this.ddAngle = 0;
      this.dampDAngle = 1;
      this.dampDDAngle = 1;
      this.changeDirectionChance = 0;
      this.maxLength = Number.POSITIVE_INFINITY;
      this.weight = 2;
      this.margin = Math.min(100, 0.1 * this.canvas.width);
      this.lineHeight = 30;
      this.letterSpacing = 10;
      this.baseX = Number.POSITIVE_INFINITY;
      return this.baseY = this.margin - this.lineHeight;
    };

    Pen.prototype.angleFilter = function() {
      return this.angle;
    };

    Pen.prototype.resetPoint = function() {
      this.age = 0;
      this.pos = new Vec(this.baseX, this.baseY);
      this.newLineIfNeeded();
      return this.changeDirection();
    };

    Pen.prototype.newLineIfNeeded = function() {
      this.baseX += this.letterSpacing * this.scale;
      if (this.baseX > this.canvas.width - this.margin) {
        this.baseX = this.margin;
        this.baseY += this.lineHeight * this.scale;
      }
      if (this.baseY > this.canvas.height - this.margin) {
        return this.done = true;
      }
    };

    Pen.prototype.changeDirection = function() {
      this.angle = randAngle();
      this.dAngle = 0.005 * rand();
      this.ddAngle = 0.0005 * rand();
      this.changeDirectionChance = 0.001;
      this.dampDAngle = 1;
      this.dampDDAngle = 1;
      return this.maxLength = 200 + Math.random() * 100;
    };

    Pen.prototype.step = function() {
      if (typeof this.onStep === "function") {
        this.onStep();
      }
      if (this.age > this.maxLength) {
        this.resetPoint();
      }
      if (this.pos.x < 0 || this.pos.y < 0 || this.pos.x > this.canvas.width || this.pos.y > this.canvas.height) {
        this.resetPoint();
      }
      this.age++;
      this.pos.x += this.scale * 0.1 * Math.cos(this.angleFilter());
      this.pos.y += this.scale * 0.1 * Math.sin(this.angleFilter());
      this.dAngle += this.ddAngle;
      this.angle += this.dAngle;
      this.dAngle *= this.dampDAngle;
      this.ddAngle *= this.dampDDAngle;
      if (Math.random() < this.changeDirectionChance) {
        return this.changeDirection();
      }
    };

    return Pen;

  })();

  Roboglypics = (function() {

    function Roboglypics(canvasEl, settings) {
      this.canvasEl = canvasEl;
      this.settings = settings;
      this.onRender = __bind(this.onRender, this);

      this.speed = 100;
      this.pen = null;
      this.a = canvasEl.getContext('2d');
      this.canvasEl.width = this.canvasEl.offsetWidth;
      this.canvasEl.height = this.canvasEl.offsetHeight;
      window.requestAnimationFrame(this.onRender);
    }

    Roboglypics.prototype.onRender = function() {
      var i, _i, _ref, _ref1;
      this.a.fillStyle = 'black';
      if (this.settings.currentMode) {
        for (i = _i = 0, _ref = this.settings.speed; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
          if (!(this.pen != null)) {
            this.a.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
            if ((_ref1 = this.pen) == null) {
              this.pen = new this.settings.currentMode(this.canvasEl);
            }
          }
          this.pen.step();
          if (this.pen.done) {
            return;
          }
          this.a.save();
          this.a.translate(this.pen.pos.x, this.pen.pos.y);
          this.a.beginPath();
          this.a.arc(0, 0, 3, this.pen.weight * this.pen.scale, 0, Math.PI * 2, true);
          this.a.fill();
          this.a.restore();
        }
        return window.requestAnimationFrame(this.onRender);
      }
    };

    return Roboglypics;

  })();

  modes = [];

  MODE = function(klass) {
    return modes.push(klass);
  };

  MODE(Clef = (function(_super) {

    __extends(Clef, _super);

    function Clef() {
      return Clef.__super__.constructor.apply(this, arguments);
    }

    Clef.prototype.onSetup = function() {
      return this.scale = 2;
    };

    Clef.prototype.angleFilter = function() {
      return Math.PI * 2 * Math.sin(this.angle * 100);
    };

    Clef.prototype.onStep = function() {
      return this.weight = this.age / this.maxLength;
    };

    Clef.prototype.changeDirection = function() {
      this.angle = randAngle();
      this.dAngle = 0.0005 * rand();
      this.ddAngle = 0;
      this.changeDirectionChance = 0.001;
      this.dampDAngle = 1;
      this.dampDDAngle = 1;
      return this.maxLength = 500 + Math.random() * 600;
    };

    return Clef;

  })(Pen));

  MODE(Roboglyph = (function(_super) {

    __extends(Roboglyph, _super);

    function Roboglyph() {
      return Roboglyph.__super__.constructor.apply(this, arguments);
    }

    Roboglyph.prototype.angleFilter = function() {
      var mult;
      mult = Math.PI / 3;
      return Math.round(this.angle / mult) * mult;
    };

    return Roboglyph;

  })(Pen));

  MODE(Loopy = (function(_super) {

    __extends(Loopy, _super);

    function Loopy() {
      return Loopy.__super__.constructor.apply(this, arguments);
    }

    Loopy.prototype.changeDirection = function() {
      this.angle = randAngle();
      this.dAngle = 0.005 * rand();
      this.ddAngle = 0.0005 * rand();
      this.changeDirectionChance = 0.001;
      this.dampDAngle = 1;
      this.dampDDAngle = 1;
      return this.maxLength = 200 + Math.random() * 100;
    };

    return Loopy;

  })(Pen));

  MODE(Giraffes = (function(_super) {

    __extends(Giraffes, _super);

    function Giraffes() {
      return Giraffes.__super__.constructor.apply(this, arguments);
    }

    Giraffes.prototype.changeDirection = function() {
      this.angle = -Math.PI / 2;
      this.dAngle = 0.005 * rand();
      this.ddAngle = 0.0005 * rand();
      this.changeDirectionChance = 0.005;
      this.dampDAngle = 1;
      this.dampDDAngle = 1;
      return this.maxLength = 200 + Math.random() * 100;
    };

    return Giraffes;

  })(Pen));

  MODE(Leonardo = (function(_super) {

    __extends(Leonardo, _super);

    function Leonardo() {
      return Leonardo.__super__.constructor.apply(this, arguments);
    }

    Leonardo.prototype.changeDirection = function() {
      this.angle = randAngle();
      this.dAngle = 0.02 * rand() * 0.5;
      this.ddAngle = 0.01 * rand() * 0.5;
      this.changeDirectionChance = 0.008;
      this.dampDAngle = 0.99;
      this.dampDDAngle = 0.99;
      return this.maxLength = 200 + Math.random() * 600;
    };

    return Leonardo;

  })(Pen));

  MODE(Fantasy = (function(_super) {

    __extends(Fantasy, _super);

    function Fantasy() {
      return Fantasy.__super__.constructor.apply(this, arguments);
    }

    Fantasy.prototype.changeDirection = function() {
      this.angle = randAngle();
      this.dAngle = 0.005 + 0.06 * Math.random();
      this.ddAngle = 0;
      this.changeDirectionChance = 0;
      this.dampDAngle = 1;
      this.dampDDAngle = 1;
      return this.maxLength = 200 + Math.random() * 600;
    };

    return Fantasy;

  })(Pen));

  MODE(BassClef = (function(_super) {

    __extends(BassClef, _super);

    function BassClef() {
      return BassClef.__super__.constructor.apply(this, arguments);
    }

    BassClef.prototype.onSetup = function() {
      return this.scale = 2;
    };

    BassClef.prototype.angleFilter = function() {
      return Math.PI * 2 * Math.sin(this.angle * 100);
    };

    BassClef.prototype.onStep = function() {
      return this.weight = 2 * (1 - this.age / this.maxLength);
    };

    BassClef.prototype.changeDirection = function() {
      this.angle = randAngle();
      this.dAngle = 0.0005 * rand();
      this.ddAngle = 0;
      this.changeDirectionChance = 0.001;
      this.dampDAngle = 1;
      this.dampDDAngle = 1;
      return this.maxLength = 500 + Math.random() * 600;
    };

    return BassClef;

  })(Pen));

  MODE(Stacatto = (function(_super) {

    __extends(Stacatto, _super);

    function Stacatto() {
      return Stacatto.__super__.constructor.apply(this, arguments);
    }

    Stacatto.prototype.onSetup = function() {
      return this.scale = 2.5;
    };

    Stacatto.prototype.angleFilter = function() {
      return Math.PI * 2 * Math.sin(this.angle * 100);
    };

    Stacatto.prototype.onStep = function() {
      this.weight = 2 * (1 - this.age / this.maxLength);
      if (this.age % 200 < 100) {
        return this.weight = 0.5;
      }
    };

    Stacatto.prototype.changeDirection = function() {
      this.angle = randAngle();
      this.dAngle = 0.0005 * rand();
      this.ddAngle = 0;
      this.changeDirectionChance = 0.001;
      this.dampDAngle = 1;
      this.dampDDAngle = 1;
      return this.maxLength = 500 + Math.random() * 600;
    };

    return Stacatto;

  })(Pen));

  MODE(Madman = (function(_super) {

    __extends(Madman, _super);

    function Madman() {
      return Madman.__super__.constructor.apply(this, arguments);
    }

    Madman.prototype.angleFilter = function() {
      if (this.age % 70 < 60) {
        return Math.PI * 2 * Math.cos(this.angle);
      } else {
        return rand() * Math.PI;
      }
    };

    Madman.prototype.changeDirection = function() {
      this.weight = Math.random();
      this.angle = randAngle();
      this.dAngle = 0.005 * rand();
      this.ddAngle = 0.001 * rand();
      this.changeDirectionChance = 0.1;
      this.dampDAngle = 0.9;
      this.dampDDAngle = 0.9;
      return this.maxLength = 500 + Math.random() * 600;
    };

    return Madman;

  })(Pen));

  window.rg = {
    Roboglypics: Roboglypics,
    Pen: Pen,
    Vec: Vec,
    modes: modes
  };

}).call(this);