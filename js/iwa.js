// IWA
(function() {
	'use strict';
	var iwa = function() {

		// Stores
		var $toolbar = $('#iwa-toolbar'),
			$container = $('#iwa-container'),
			$dimmer = $('#iwa-dimmer'),
			dataProject = null,
			MESSAGE = {
				$message: $('#iwa-msg'),
				showed: false,
				show: function(op) {
					var self = this,
						cfg = $.extend({
							'text': '',
							'color': '#333',
							'timeToHide': null
						}, op);

					this.$message.addClass('show').html('<span style="color:' + cfg.color + '">' + cfg.text + '</span>');
					if (cfg.timeToHide !== null) {
						setTimeout(function() {
							self.hide();
						}, cfg.timeToHide);
					}
				},
				hide: function() {
					this.$message.removeClass('show');
				}
			},

			// TOOLBAR
			TOOLBAR = {
				set: function() {
					$('#iwa-show-toolbar').click(function() {
						$toolbar.toggleClass('show');
					});
					$('#iwa-load-btn').click(function() {
						MODAL.show('iwa-load-modal');
					});

					$('#iwa-modal-load-btn').click(function() {
						var n = $('#iwa-load-input-name').val();
						MODAL.hide();
						TOOLBAR.hide();
						load(n);
					});
					return this;
				},
				show: function() {
					$toolbar.addClass('show');
					return this;
				},
				hide: function() {
					$toolbar.removeClass('show');
					return this;
				}
			},


			MODAL = {
				current: null,
				duration: 200,
				show: function(id) {
					var self = this;
					$dimmer.fadeIn(this.duration);
					this.current = $('#' + id);
					var marginTop = this.current.height() / 2;
					this.current.css('margin-top', '-' + marginTop + 'px').fadeIn(this.duration)
						.find('.cancel-btn').click(function() {
							self.hide();
						});
				},
				hide: function() {
					if (this.current !== null) {
						this.current.fadeOut(this.duration);
						$dimmer.fadeOut(this.duration);
					}
				}
			},
			renderPage = (function() {

				var zInd = 20,
					renderDiv = function(divData) {
						var $div = $('<div class="iwa-page-div"></div>'),
						positionValues = divData.positionValues.split(','),
						sufixSize= function(str){
							return (str === 'auto') ? '' : '%';
						};

						$div.css({
							position: divData.position,
							left: parseFloat(positionValues[0])+'%',
							top: parseFloat(positionValues[1])+'%',
							width: divData.width + sufixSize(divData.width),
							height: divData.height + sufixSize(divData.height)
						});

						$container.append($div);

						$('<img src="projects/' + dataProject.name + '/' + divData.image.src + '"/>').appendTo($div);

						for (var a in divData.links) {
							var link = divData.links[a],
								positionLink = link.position.split(','),
								dimensionsLink = link.dimensions.split(',');
								
							$('<a href="' + link.href + '"></a>').css({
								left: parseFloat(positionLink[0]) + '%',
								top: parseFloat(positionLink[1]) + '%',
								width: parseFloat(dimensionsLink[0]) + '%',
								height: parseFloat(dimensionsLink[1]) + '%'
							}).appendTo($div);
						}

						$div.find('a').click(function(e){
							var h = $(this).attr('href');
							if(h.indexOf('#') === 0){
								e.preventDefault();
								var n = h.substring(1);
								renderPage(n);
							}
						});

					};

				return function(pageId) {
					$container.html('');

					var divsData = dataProject.pages['page' + pageId].divs;
					zInd = 20;

					for (var a in divsData) {
						renderDiv(divsData[a]);
					}
				}
			})(),


			storeProject = function(data) {
				dataProject = data;
				renderPage(0);
			},
			load = function(name) {
				MESSAGE.show({
					text: 'Loading'
				});
				$.ajax({
					dataType: 'json',
					url: 'projects/' + name + '/project.json',
					success: function(data) {
						MESSAGE.show({
							text: 'Loaded successfully.',
							color: '#090',
							timeToHide: 2000
						});
						storeProject(data);
					},
					error: function(data) {
						MESSAGE.show({
							text: 'Error loading project. Please, try again.',
							color: '#D00',
							timeToHide: 2000
						});
					}
				});
			};

		// Exec
		// TOOLBAR
		TOOLBAR.set();



	};
	$('document').ready(iwa);
})();