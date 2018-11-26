(function() {
	//线的宽度
	var mBorderwidth = 4;
	//波长
	var mWaveLength = 50;
	//波高度
	var mWaveheight = 8;
	var mWaveDx = 0;
	//当前进度
	var mProgress = 0;
	//最大值
	var mMaxValue = 100;
	var rem = "rem";
	var px = "px";
	//圆的颜色
	var mCircleColor = "#FBEC99";
	//波浪的颜色
	var mWaveColor = "#FBEC99";
	var mTextSize = 30;
	var mTextColor = "#F6B71E";
	var ctx;
	var width = 0;
	var height = 0;
	//波浪移动速度
	var mWaveSpeed = 2;
	//参数传入canvas的id

	function WaveCircleProgress(id) {
		var myCanvas = document.getElementById(id);
		this.ctx = myCanvas.getContext("2d");
		this.mProgress = mProgress;
		this.mMaxValue = mMaxValue;
		this.mCircleColor = mCircleColor;
		this.mBorderwidth = mBorderwidth;
		this.mWaveColor = mWaveColor;
		this.mTextColor = mTextColor;
		this.mTextSize = mTextSize;
		this.mWaveLength = mWaveLength;
		this.mWaveheight = mWaveheight;
		this.width = parseInt(myCanvas.getAttribute("width").replace(px, "").replace(rem, ""));
		this.height = parseInt(myCanvas.getAttribute("height").replace(px, "").replace(rem, ""));
		this.setProgress = function(progress) {
			if(progress) {
				if(this.chechkNum(progress)) {
					if(progress <= 0) {
						progress = 0;
					}
					if(progress >= mMaxValue) {
						progress = mMaxValue;
					}
					this.mProgress = progress;
					this.isCancel = true;
					draw(this);
				} else {
					throw "the progress is not Number";
				}
			};
		}
		this.getProgress = function() {
			return this.mProgress;
		};
		this.setWaveColor = function(color) {
			if(color) {
				this.mWaveColor = color;
				draw(this);
			}
		};
		this.getWaveColor = function() {
			return this.mWaveColor;
		};
		this.setTextSize = function(size) {
			if(size) {
				this.mTextSize = size;
				draw(this);
			}
		};
		this.getTextSize = function() {
			return this.mTextSize;
		};

		this.setTextColor = function(color) {
			if(color) {
				this.mTextColor = color;
				draw(this);
			}
		};
		this.getTextColor = function() {
			return this.mTextColor;
		};

		this.setCircleColor = function(color) {
			if(color) {
				this.mCircleColor = color;
				draw(this);
			}
		};
		this.getCircleColor = function() {
			return this.mCircleColor;
		};
		draw(this);
		return this;
	}

	WaveCircleProgress.prototype = {
		constructor: WaveCircleProgress,
		chechkNum: function(value) {
			if(!value) {
				return false;
			}
			if(Object.prototype.toString.call(value) == "[object Number]") {
				return true;
			}
			try {
				if(parseInt(value)) {
					return true;
				}
			} catch(e) {
				console.log(e.message);
			}
			return false;
		}
	};

	function draw(obj) {
		drawCircle(obj);
		drawWave(obj);
		drawText(obj);
	}

	//画圆
	function drawCircle(obj) {
		if(!obj.width) {
			w = 200;
		}
		if(!obj.height) {
			h = 200;
		}
		var c = obj.ctx;
		if(c) {
			var X = obj.width / 2;
			var Y = obj.height / 2;
			radius = ((obj.width >= obj.height) ? (obj.height / 2) : obj.width / 2) - 2 * obj.mBorderwidth;
			c.strokeStyle = obj.mCircleColor;
			c.lineWidth = obj.mBorderwidth;
			c.beginPath();
			c.arc(X, Y, radius, 0, Math.PI * 2, true);
			c.closePath();
			c.stroke();
			c.clip();
		}
	}
	//画波浪
	function drawWave(obj) {
		if(!obj.width) {
			w = 200;
		}
		if(!obj.height) {
			h = 200;
		}
		var mWaveDy;
		var c = obj.ctx;
		var h = obj.height;

		var w = obj.width;
		var pro = obj.mProgress;

		if(c) {
			var mWaveHalfLength = obj.mwal / 2;
			c.fillStyle = obj.mWaveColor;
			c.save();
			c.beginPath();
			if(pro == 0) {
				mWaveDy = h;
			} else if(pro == obj.mMaxValue) {
				mWaveDy = 0;
			} else if(pro <= obj.mBorderwidth) {
				//进度小于线宽 圆的线过宽会遮住波浪 所以上移一点
				mWaveDy = h - 2 * obj.mBorderwidth;
			} else if(pro >= obj.mMaxValue - obj.mBorderwidth) {
				//避免遮住 下移一点
				mWaveDy = h - (pro / obj.mMaxValue) * h + 2 * obj.mBorderwidth;
			} else {
				mWaveDy = h - (pro / obj.mMaxValue) * h;
			}
			//画曲线
			c.moveTo(mWaveDx - 2 * mWaveLength, mWaveDy);
			for(var j = -2; j <= 4; j++) {
				if(j % 2 == 0) {
					y = mWaveDy + mWaveheight;
				} else {
					y = mWaveDy - mWaveheight;
				}
				c.quadraticCurveTo(mWaveDx + mWaveLength * (2 * j - 1) / 2, y, mWaveDx + mWaveLength * j, mWaveDy);
			}
			c.lineTo(w, h);
			c.lineTo(0, h);
			c.closePath();
			c.fill();
			c.restore();
			if(window.requestAnimationFrame) {

				if(obj.anim) {
					//清楚重复
					cancelAnimationFrame(obj.anim);
				}
				var id = window.requestAnimationFrame(function() {
					//波浪移动
					mWaveDx += mWaveSpeed;
					if(mWaveDx >= 2 * mWaveLength) {
						mWaveDx = 0;
					}
					c.clearRect(0, 0, w, h);
					draw(obj);
				});
				obj.anim = id;
			}

		}
	};
	//画文字
	function drawText(obj) {
		var X = obj.width / 2;
		var Y = obj.height / 2;
		var c = obj.ctx;
		c.fillStyle = obj.mTextColor;
		c.font = "bold " + obj.mTextSize + "px Microsoft Yahei";
		c.textBaseline = "middle";
		var info = obj.mProgress + "%";
		c.fillText(info, X - c.measureText(info).width / 2, Y, 100);
		c.fillStyle = obj.mWaveColor;
	};
	window.WaveCircleProgress = WaveCircleProgress;
})();