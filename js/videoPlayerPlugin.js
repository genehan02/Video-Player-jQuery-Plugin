(function($) {
	$.videoPlayerPlugin = function(element, options) {
		var plugin = this;
		plugin.settings = {};

		var defaults = {
			autoPlay: false
		}

		var $element = $(element);
		var elementElem = element;

		var $video = $element.find("video");
		var videoElem = element.getElementsByTagName("video")[0];
		var $videoSources = $element.find("video source");
		// Player controls:
		var $controlBar = $element.find(".vpp-control-items");
		var $seekSlider = $element.find(".vpp-seek-slider");
		var $durationElem = $element.find(".time-duration");
		var $currentTimeElem = $element.find(".vpp-time-current");
		var $volumeBtn = $element.find(".vpp-volume-btn");
		var $volumeIcon = $element.find(".unmute-btn");
		var $volumeSlider = $element.find(".vpp-volume-slider input");
		var $fullScreenBtn = $element.find(".fullscreen-enter-btn");

		var seekIsPaused = false;
		var seekMouseDown = false;

		plugin.init = function() {
			plugin.settings = $.extend({}, defaults, options);

			// Disable right-click menu
			$element.bind("contextmenu",function() {
				return false;
			});

			// Insert video cource element's src attribute
			$.each($videoSources, function(index, value) {
				// Match source type to plugin settings 'type' key/value
				var videoType = value.getAttribute("type");

				value.setAttribute("src", plugin.settings.videoSources[videoType]);
			})
			// Reload videos after adding src's
			videoElem.load();

			plugin.getDuration();
			plugin.getCurrentTime();

			// Automatically play video on load. Default: false
			if (plugin.settings.autoPlay) {
				plugin.play();
			}

			// Play click handler
			$element.find(".vpp-play-btn, video").on("click", function() {
				togglePlay();

				$video.focus();
			});

			$(document).keydown(function (e) {
				if($video.is(":focus")){
					if (e.keyCode === 32) {
						e.preventDefault();

						togglePlay();
					}
				};
			})

			// Manual seek/scrub
			$seekSlider.on("mousedown", function() {
				seekMouseDown = true;
				seekIsPaused = videoElem.paused;

				plugin.pause();
			}).on("mouseup", function() {
				if(!seekMouseDown) {
					return;
				}

				var time = $(this).val();

				plugin.jumpTo(time);

				if(!seekIsPaused){
					plugin.play();
				}

				seekMouseDown = false;
			});

			// Mute click handler
			$volumeBtn.on("click", function() {
				plugin.toggleMute();
			});

			$volumeSlider.on("change", function() {
				plugin.setVolume($(this).val());
			});

			$fullScreenBtn.on("click", function() {
				plugin.toggleFullScreen();
			});

			$video.on("ended", function() {
				$element.find(".play-btn").removeClass("show-pause-btn");
				videoElem.currentTime = 0;
			});
		}

		/*=======================================
		  Public functions
		  =======================================*/
		plugin.pause = function() {
			videoElem.pause();
		}

		plugin.play = function() {
			videoElem.play();
		}

		plugin.jumpTo = function(time) {
			videoElem.currentTime = time;
		}

		plugin.setVolume = function(val) {
			videoElem.volume = val / 100;
		}

		plugin.toggleMute = function() {
			videoElem.muted ? plugin.unmute() : plugin.mute();
			$volumeIcon.toggleClass("muted");
		}

		plugin.mute = function() {
			videoElem.muted = true;
		}

		plugin.unmute = function() {
			videoElem.muted = false;
		}

		plugin.toggleFullScreen = function() {
			if(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
				if(document.exitFullscreen) {
					document.exitFullscreen();
				} else if(document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				} else if(document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if(document.msExitFullscreen) {
					document.msExitFullscreen();
				}
			} else if(elementElem.requestFullscreen) {
				elementElem.requestFullscreen();
			} else if(elementElem.webkitRequestFullscreen) {
				elementElem.webkitRequestFullscreen();
			} else if(elementElem.mozRequestFullScreen) {
				elementElem.mozRequestFullScreen();
			} else if(elementElem.msRequestFullscreen) {
				elementElem.msRequestFullscreen();
			}

			$element.toggleClass("full-screen-toggle").find(".fullscreen-enter-btn").toggleClass("full-screen-toggle");
		}

		// Get video's duration
		plugin.getDuration = function() {
			videoElem.addEventListener('durationchange', function() {
				// Format duration (in seconds) to hours, minutes, and seconds
				var duration = formatHHMMSS(videoElem.duration);

				// Update UI with the duration
				updateDurationUI(duration);

				// Set seek slider max value
				$seekSlider.attr("max", videoElem.duration)

				return duration;
			});
		}

		plugin.getCurrentTime = function() {
			videoElem.addEventListener("timeupdate", function() {
				// Format current play time (in seconds) to hours, minutes, and seconds
				var time = formatHHMMSS(videoElem.currentTime);

				updateCurrentTimeUI(time);

				updateScrubberUI(videoElem.currentTime);

				return time;
			});
		}

		/*=======================================
		  Private functions
		  =======================================*/
		function togglePlay() {
			videoElem.paused ? plugin.play() : plugin.pause();

			$element.find(".play-btn").toggleClass("show-pause-btn");
		}

		function updateCurrentTimeUI(time) {
			// Display the current position of the video
			$currentTimeElem.text(time);
		}

		function updateDurationUI(duration) {
			$durationElem.text(duration);
		}

		function updateScrubberUI(time) {
			$seekSlider.val(time);
		}

		// Convert seconds to hours, minutes, and seconds
		function formatHHMMSS(totalSeconds) {
			var formattedTime = "";

			var total = Math.round(totalSeconds);
			var hours = Math.floor(total / 3600);
			var minutes = Math.floor(total % 3600 / 60);
			var seconds = Math.floor(total % 60);

			if (!hours) {
				hours = "";
			} else {
				hours += ":";

				if (minutes < 10) {
					minutes = "0" + minutes;
				}
			}

			if(seconds < 10) {
				seconds = "0" + seconds;
			}

			formattedTime = hours + minutes + ":" + seconds;

			return formattedTime;
		}

		plugin.init();
	}

	$.fn.videoPlayerPlugin = function(options) {
		return this.each(function() {
			if (undefined == $(this).data('videoPlayerPlugin')) {
				var plugin = new $.videoPlayerPlugin(this, options);
				$(this).data('videoPlayerPlugin', plugin);
			}
		});
	}
})(jQuery);
