var postMetaBoxes=function(e){var t={};function a(o){if(t[o]){return t[o].exports}var i=t[o]={i:o,l:false,exports:{}};e[o].call(i.exports,i,i.exports,a);i.l=true;return i.exports}a.m=e;a.c=t;a.d=function(e,t,o){if(!a.o(e,t)){Object.defineProperty(e,t,{configurable:false,enumerable:true,get:o})}};a.n=function(e){var t=e&&e.__esModule?function t(){return e["default"]}:function t(){return e};a.d(t,"a",t);return t};a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)};a.p="";return a(a.s=0)}([function(e,t,a){"use strict";var o=a(1);var i=l(o);function l(e){return e&&e.__esModule?e:{default:e}}(0,i.default)(function(){var e=window.wp;var t=(0,i.default)(document.body).hasClass("block-editor-page")&&e&&e.data&&e.data.subscribe;function a(e){(0,i.default)("#x-meta-box-quote, #x-meta-box-link, #x-meta-box-video, #x-meta-box-audio").css("display","none");if(e){(0,i.default)("#x-meta-box-"+e).css("display","block")}}var o=(0,i.default)('#post-formats-select input[type=radio][name="post_format"]');if(o.length>0){a((0,i.default)('#post-formats-select input[type=radio][name="post_format"]:checked').val());o.change(function(){a((0,i.default)(this).val())})}if(t){a();e.data.subscribe(function(){var t=e.data.select("core/editor").getEditedPostAttribute("format");if(t)a(t)})}var l=["template-blank-7.php","template-blank-3.php","template-blank-8.php","template-blank-6.php"];function n(e){(0,i.default)("#x-meta-box-page-icon").toggle(0===(e||"").indexOf("template-blank"));(0,i.default)("#x-meta-box-portfolio").toggle(e==="template-layout-portfolio.php");(0,i.default)("#x-meta-box-slider-above, #x-meta-box-slider-below").toggle(!l.includes(e))}var s=(0,i.default)("#page_template");if(s.length>0){n(s.val());s.on("change",function(){n(s.val())})}if(t){n();var r="";e.data.subscribe(function(){var t=e.data.select("core/editor").getEditedPostAttribute("template");if(r!==t){n(t);r=t}})}var d=(0,i.default)("#_x_slider_above");var u=d.parents("tr").siblings();if((0,i.default)("#_x_slider_above option:selected").text()==="Deactivated"){u.css("display","none")}d.change(function(){if((0,i.default)("#_x_slider_above option:selected").text()==="Deactivated"){u.css("display","none")}else{u.css("display","table-row")}});var c=(0,i.default)("#_x_slider_below");var f=c.parents("tr").siblings();if((0,i.default)("#_x_slider_below option:selected").text()==="Deactivated"){f.css("display","none")}c.change(function(){if((0,i.default)("#_x_slider_below option:selected").text()==="Deactivated"){f.css("display","none")}else{f.css("display","table-row")}});var p=(0,i.default)("#x-meta-box-portfolio-item-video");if(!(0,i.default)('input[name*="_x_portfolio_media"][value="Video"]').is(":checked")){p.css("display","none")}(0,i.default)('input[name*="_x_portfolio_media"]').change(function(){if(!(0,i.default)('input[name*="_x_portfolio_media"][value="Video"]').is(":checked")){p.css("display","none")}else{p.css("display","block")}});(0,i.default)(".wp-color-picker").wpColorPicker()})},function(e,t){e.exports=window.jQuery}]);
//# sourceMappingURL=x-meta.js.map