/*!
ziggeo-client-sdk - v2.38.2 - 2021-05-18
Copyright (c) Ziggeo
Closed Source Software License.
*/

!function(o,i){var p={};p.DEBUG=!1,p.VERSION="0.0.11",p.CONTEXT="player.js",p.POST_MESSAGE=!!o.postMessage,p.origin=function(e){return"//"===e.substr(0,2)&&(e=o.location.protocol+e),e.split("/").slice(0,3).join("/")},p.addEvent=function(e,t,n){e&&(e.addEventListener?e.addEventListener(t,n,!1):e.attachEvent?e.attachEvent("on"+t,n):e["on"+t]=n)},p.log=function(){p.log.history=p.log.history||[],p.log.history.push(arguments),o.console&&p.DEBUG&&o.console.log(Array.prototype.slice.call(arguments))},p.isString=function(e){return"[object String]"===Object.prototype.toString.call(e)},p.isObject=function(e){return"[object Object]"===Object.prototype.toString.call(e)},p.isArray=function(e){return"[object Array]"===Object.prototype.toString.call(e)},p.isNone=function(e){return null===e||e===undefined},p.has=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},p.indexOf=function(e,t){if(null==e)return-1;var n=0,i=e.length;if(Array.prototype.IndexOf&&e.indexOf===Array.prototype.IndexOf)return e.indexOf(t);for(;n<i;n++)if(e[n]===t)return n;return-1},p.assert=function(e,t){if(!e)throw t||"Player.js Assert Failed"},p.Keeper=function(){this.init()},p.Keeper.prototype.init=function(){this.data={}},p.Keeper.prototype.getUUID=function(){return"listener-xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=16*Math.random()|0;return("x"===e?t:3&t|8).toString(16)})},p.Keeper.prototype.has=function(e,t){if(!this.data.hasOwnProperty(e))return!1;if(p.isNone(t))return!0;for(var n=this.data[e],i=0;i<n.length;i++)if(n[i].id===t)return!0;return!1},p.Keeper.prototype.add=function(e,t,n,i,r){var o={id:e,event:t,cb:n,ctx:i,one:r};this.has(t)?this.data[t].push(o):this.data[t]=[o]},p.Keeper.prototype.execute=function(e,t,n,i){if(!this.has(e,t))return!1;for(var r=[],o=[],s=0;s<this.data[e].length;s++){var a=this.data[e][s];p.isNone(t)||!p.isNone(t)&&a.id===t?(o.push({cb:a.cb,ctx:a.ctx?a.ctx:i,data:n}),!1===a.one&&r.push(a)):r.push(a)}0===r.length?delete this.data[e]:this.data[e]=r;for(var u=0;u<o.length;u++){var c=o[u];c.cb.call(c.ctx,c.data)}},p.Keeper.prototype.on=function(e,t,n,i){this.add(e,t,n,i,!1)},p.Keeper.prototype.one=function(e,t,n,i){this.add(e,t,n,i,!0)},p.Keeper.prototype.off=function(e,t){var n=[];if(!this.data.hasOwnProperty(e))return n;for(var i=[],r=0;r<this.data[e].length;r++){var o=this.data[e][r];p.isNone(t)||o.cb===t?p.isNone(o.id)||n.push(o.id):i.push(o)}return 0===i.length?delete this.data[e]:this.data[e]=i,n},p.Player=function(e,t){if(!(this instanceof p.Player))return new p.Player(e,t);this.init(e,t)},p.EVENTS={READY:"ready",PLAY:"play",PAUSE:"pause",ENDED:"ended",TIMEUPDATE:"timeupdate",PROGRESS:"progress",ERROR:"error"},p.EVENTS.all=function(){var e=[];for(var t in p.EVENTS)p.has(p.EVENTS,t)&&p.isString(p.EVENTS[t])&&e.push(p.EVENTS[t]);return e},p.METHODS={PLAY:"play",PAUSE:"pause",GETPAUSED:"getPaused",MUTE:"mute",UNMUTE:"unmute",GETMUTED:"getMuted",SETVOLUME:"setVolume",GETVOLUME:"getVolume",GETDURATION:"getDuration",SETCURRENTTIME:"setCurrentTime",GETCURRENTTIME:"getCurrentTime",SETLOOP:"setLoop",GETLOOP:"getLoop",REMOVEEVENTLISTENER:"removeEventListener",ADDEVENTLISTENER:"addEventListener"},p.METHODS.all=function(){var e=[];for(var t in p.METHODS)p.has(p.METHODS,t)&&p.isString(p.METHODS[t])&&e.push(p.METHODS[t]);return e},p.READIED=[],p.Player.prototype.init=function(e,t){var n=this;p.isString(e)&&(e=i.getElementById(e)),this.elem=e,p.assert("IFRAME"===e.nodeName,'playerjs.Player constructor requires an Iframe, got "'+e.nodeName+'"'),p.assert(e.src,"playerjs.Player constructor requires a Iframe with a 'src' attribute."),this.origin=p.origin(e.src),this.keeper=new p.Keeper,this.isReady=!1,this.queue=[],this.events=p.EVENTS.all(),this.methods=p.METHODS.all(),p.POST_MESSAGE?p.addEvent(o,"message",function(e){n.receive(e)}):p.log("Post Message is not Available."),-1<p.indexOf(p.READIED,e.src)?n.loaded=!0:this.elem.onload=function(){n.loaded=!0}},p.Player.prototype.send=function(e,t,n){var i;return e.context=p.CONTEXT,e.version=p.VERSION,t&&(i=this.keeper.getUUID(),e.listener=i,this.keeper.one(i,e.method,t,n)),this.isReady||"ready"===e.value?(p.log("Player.send",e,this.origin),!0===this.loaded&&this.elem.contentWindow.postMessage(JSON.stringify(e),this.origin),!0):(p.log("Player.queue",e),this.queue.push(e),!1)},p.Player.prototype.receive=function(e){if(p.log("Player.receive",e),e.origin!==this.origin)return!1;var t;try{t=JSON.parse(e.data)}catch(n){return!1}if(t.context!==p.CONTEXT)return!1;"ready"===t.event&&t.value&&t.value.src===this.elem.src&&this.ready(t),this.keeper.has(t.event,t.listener)&&this.keeper.execute(t.event,t.listener,t.value,this)},p.Player.prototype.ready=function(e){if(!0===this.isReady)return!1;e.value.events&&(this.events=e.value.events),e.value.methods&&(this.methods=e.value.methods),this.isReady=!0,this.loaded=!0;for(var t=0;t<this.queue.length;t++){var n=this.queue[t];p.log("Player.dequeue",n),"ready"===e.event&&this.keeper.execute(n.event,n.listener,!0,this),this.send(n)}this.queue=[]},p.Player.prototype.on=function(e,t,n){var i=this.keeper.getUUID();return"ready"===e?this.keeper.one(i,e,t,n):this.keeper.on(i,e,t,n),this.send({method:"addEventListener",value:e,listener:i}),!0},p.Player.prototype.off=function(e,t){var n=this.keeper.off(e,t);if(p.log("Player.off",n),0<n.length)for(var i in n)return this.send({method:"removeEventListener",value:e,listener:n[i]}),!0;return!1},p.Player.prototype.supports=function(e,t){p.assert(-1<p.indexOf(["method","event"],e),'evtOrMethod needs to be either "event" or "method" got '+e),t=p.isArray(t)?t:[t];for(var n="event"===e?this.events:this.methods,i=0;i<t.length;i++)if(-1===p.indexOf(n,t[i]))return!1;return!0};for(var e=0,t=p.METHODS.all().length;e<t;e++){var n=p.METHODS.all()[e];p.Player.prototype.hasOwnProperty(n)||(p.Player.prototype[n]=function(n){return function(){var e={method:n},t=Array.prototype.slice.call(arguments);/^get/.test(n)?(p.assert(0<t.length,"Get methods require a callback."),t.unshift(e)):(/^set/.test(n)&&(p.assert(0!==t.length,"Set methods require a value."),e.value=t[0]),t=[e]),this.send.apply(this,t)}}(n))}p.addEvent(o,"message",function(e){var t;try{t=JSON.parse(e.data)}catch(n){return!1}if(t.context!==p.CONTEXT)return!1;"ready"===t.event&&t.value&&t.value.src&&p.READIED.push(t.value.src)}),p.Receiver=function(e,t){this.init(e,t)},p.Receiver.prototype.init=function(e,t){var n=this;this.isReady=!1,this.origin=p.origin(i.referrer),this.methods={},this.supported={events:e||p.EVENTS.all(),methods:t||p.METHODS.all()},this.eventListeners={},this.reject=!(o.self!==o.top&&p.POST_MESSAGE),this.reject||p.addEvent(o,"message",function(e){n.receive(e)})},p.Receiver.prototype.receive=function(e){if(e.origin!==this.origin)return!1;var t={};if(p.isObject(e.data))t=e.data;else try{t=o.JSON.parse(e.data)}catch(r){p.log("JSON Parse Error",r)}if(p.log("Receiver.receive",e,t),!t.method)return!1;if(t.context!==p.CONTEXT)return!1;if(-1===p.indexOf(p.METHODS.all(),t.method))return this.emit("error",{code:2,msg:'Invalid Method "'+t.method+'"'}),!1;var n,i=p.isNone(t.listener)?null:t.listener;"addEventListener"===t.method?(this.eventListeners.hasOwnProperty(t.value)?-1===p.indexOf(this.eventListeners[t.value],i)&&this.eventListeners[t.value].push(i):this.eventListeners[t.value]=[i],"ready"===t.value&&this.isReady&&this.ready()):"removeEventListener"===t.method?this.eventListeners.hasOwnProperty(t.value)&&(-1<(n=p.indexOf(this.eventListeners[t.value],i))&&this.eventListeners[t.value].splice(n,1),0===this.eventListeners[t.value].length&&delete this.eventListeners[t.value]):this.get(t.method,t.value,i)},p.Receiver.prototype.get=function(t,e,n){var i=this;if(!this.methods.hasOwnProperty(t))return this.emit("error",{code:3,msg:'Method Not Supported"'+t+'"'}),!1;var r=this.methods[t];"get"===t.substr(0,3)?r.call(this,function(e){i.send(t,e,n)}):r.call(this,e)},p.Receiver.prototype.on=function(e,t){this.methods[e]=t},p.Receiver.prototype.send=function(e,t,n){if(p.log("Receiver.send",e,t,n),this.reject)return p.log("Receiver.send.reject",e,t,n),!1;var i={context:p.CONTEXT,version:p.VERSION,event:e};p.isNone(t)||(i.value=t),p.isNone(n)||(i.listener=n);var r=JSON.stringify(i);o.parent.postMessage(r,""===this.origin?"*":this.origin)},p.Receiver.prototype.emit=function(e,t){if(!this.eventListeners.hasOwnProperty(e))return!1;p.log("Instance.emit",e,t,this.eventListeners[e]);for(var n=0;n<this.eventListeners[e].length;n++){var i=this.eventListeners[e][n];this.send(e,t,i)}return!0},p.Receiver.prototype.ready=function(){p.log("Receiver.ready"),this.isReady=!0;var e={src:o.location.toString(),events:this.supported.events,methods:this.supported.methods};this.emit("ready",e)||this.send("ready",e)},p.HTML5Adapter=function(e){if(!(this instanceof p.HTML5Adapter))return new p.HTML5Adapter(e);this.init(e)},p.HTML5Adapter.prototype.init=function(t){p.assert(t,"playerjs.HTML5Adapter requires a video element");var e=this.receiver=new p.Receiver;t.addEventListener("playing",function(){e.emit("play")}),t.addEventListener("pause",function(){e.emit("pause")}),t.addEventListener("ended",function(){e.emit("ended")}),t.addEventListener("timeupdate",function(){e.emit("timeupdate",{seconds:t.currentTime,duration:t.duration})}),t.addEventListener("progress",function(){e.emit("buffered",{percent:t.buffered.length})}),e.on("play",function(){t.play()}),e.on("pause",function(){t.pause()}),e.on("getPaused",function(e){e(t.paused)}),e.on("getCurrentTime",function(e){e(t.currentTime)}),e.on("setCurrentTime",function(e){t.currentTime=e}),e.on("getDuration",function(e){e(t.duration)}),e.on("getVolume",function(e){e(100*t.volume)}),e.on("setVolume",function(e){t.volume=e/100}),e.on("mute",function(){t.muted=!0}),e.on("unmute",function(){t.muted=!1}),e.on("getMuted",function(e){e(t.muted)}),e.on("getLoop",function(e){e(t.loop)}),e.on("setLoop",function(e){t.loop=e})},p.HTML5Adapter.prototype.ready=function(){this.receiver.ready()},p.JWPlayerAdapter=function(e){if(!(this instanceof p.JWPlayerAdapter))return new p.JWPlayerAdapter(e);this.init(e)},p.JWPlayerAdapter.prototype.init=function(t){p.assert(t,"playerjs.JWPlayerAdapter requires a player object");var r=this.receiver=new p.Receiver;this.looped=!1,t.on("pause",function(){r.emit("pause")}),t.on("play",function(){r.emit("play")}),t.on("time",function(e){var t=e.position,n=e.duration;if(!t||!n)return!1;var i={seconds:t,duration:n};r.emit("timeupdate",i)});var e=this;t.on("complete",function(){!0===e.looped?t.seek(0):r.emit("ended")}),t.on("error",function(){r.emit("error")}),r.on("play",function(){t.play(!0)}),r.on("pause",function(){t.pause(!0)}),r.on("getPaused",function(e){e(t.getState().toLowerCase()!=="PLAYING".toLowerCase())}),r.on("getCurrentTime",function(e){e(t.getPosition())}),r.on("setCurrentTime",function(e){t.seek(e)}),r.on("getDuration",function(e){e(t.getDuration())}),r.on("getVolume",function(e){e(t.getVolume())}),r.on("setVolume",function(e){t.setVolume(e)}),r.on("mute",function(){t.setMute(!0)}),r.on("unmute",function(){t.setMute(!1)}),r.on("getMuted",function(e){e(!0===t.getMute())}),r.on("getLoop",function(e){e(this.looped)},this),r.on("setLoop",function(e){this.looped=e},this)},p.JWPlayerAdapter.prototype.ready=function(){this.receiver.ready()},p.MockAdapter=function(){if(!(this instanceof p.MockAdapter))return new p.MockAdapter;this.init()},p.MockAdapter.prototype.init=function(){var n={duration:20,currentTime:0,interval:null,timeupdate:function(){},volume:100,mute:!1,playing:!1,loop:!1,play:function(){n.interval=setInterval(function(){n.currentTime+=.25,n.timeupdate({seconds:n.currentTime,duration:n.duration})},250),n.playing=!0},pause:function(){clearInterval(n.interval),n.playing=!1}},e=this.receiver=new p.Receiver;e.on("play",function(){var t=this;n.play(),this.emit("play"),n.timeupdate=function(e){t.emit("timeupdate",e)}}),e.on("pause",function(){n.pause(),this.emit("pause")}),e.on("getPaused",function(e){e(!n.playing)}),e.on("getCurrentTime",function(e){e(n.currentTime)}),e.on("setCurrentTime",function(e){n.currentTime=e}),e.on("getDuration",function(e){e(n.duration)}),e.on("getVolume",function(e){e(n.volume)}),e.on("setVolume",function(e){n.volume=e}),e.on("mute",function(){n.mute=!0}),e.on("unmute",function(){n.mute=!1}),e.on("getMuted",function(e){e(n.mute)}),e.on("getLoop",function(e){e(n.loop)}),e.on("setLoop",function(e){n.loop=e})},p.MockAdapter.prototype.ready=function(){this.receiver.ready()},p.VideoJSAdapter=function(e){if(!(this instanceof p.VideoJSAdapter))return new p.VideoJSAdapter(e);this.init(e)},p.VideoJSAdapter.prototype.init=function(r){p.assert(r,"playerjs.VideoJSReceiver requires a player object");var o=this.receiver=new p.Receiver;r.on("pause",function(){o.emit("pause")}),r.on("play",function(){o.emit("play")}),r.on("timeupdate",function(e){var t=r.currentTime(),n=r.duration();if(!t||!n)return!1;var i={seconds:t,duration:n};o.emit("timeupdate",i)}),r.on("ended",function(){o.emit("ended")}),r.on("error",function(){o.emit("error")}),o.on("play",function(){r.play()}),o.on("pause",function(){r.pause()}),o.on("getPaused",function(e){e(r.paused())}),o.on("getCurrentTime",function(e){e(r.currentTime())}),o.on("setCurrentTime",function(e){r.currentTime(e)}),o.on("getDuration",function(e){e(r.duration())}),o.on("getVolume",function(e){e(100*r.volume())}),o.on("setVolume",function(e){r.volume(e/100)}),o.on("mute",function(){r.volume(0)}),o.on("unmute",function(){r.volume(1)}),o.on("getMuted",function(e){e(0===r.volume())}),o.on("getLoop",function(e){e(r.loop())}),o.on("setLoop",function(e){r.loop(e)})},p.VideoJSAdapter.prototype.ready=function(){this.receiver.ready()},"function"==typeof define&&define.amd?define(function(){return p}):"object"==typeof module&&module.exports?module.exports=p:o.playerjs=p}(window,document),playerjs.BetaJSAdapter=function(e){if(!(this instanceof playerjs.BetaJSAdapter))return new playerjs.BetaJSAdapter(e);this.init(e)},playerjs.BetaJSAdapter.prototype.init=function(i){playerjs.assert(i,"playerjs.BetaJSReceiver requires a player object");var r=this.receiver=new playerjs.Receiver;i.on("paused",function(){r.emit("pause")}),i.on("playing",function(){r.emit("play")}),i.on("change:position change:duration",function(){var e=i.get("position"),t=i.get("duration");if(!e||!t)return!1;var n={seconds:e,duration:t};r.emit("timeupdate",n)}),i.on("ended",function(){r.emit("ended")}),i.on("error",function(){r.emit("error")}),r.on("play",function(){i.play()}),r.on("pause",function(){i.pause()}),r.on("getPaused",function(e){e(!i.get("playing"))}),r.on("getCurrentTime",function(e){e(i.get("position"))}),r.on("setCurrentTime",function(e){i.seek(e)}),r.on("getDuration",function(e){e(i.get("duration"))}),r.on("getVolume",function(e){e(100*i.get("volume"))}),r.on("setVolume",function(e){i.set_volume(e/100)}),r.on("mute",function(){i.set_volume(0)}),r.on("unmute",function(){i.set_volume(1)}),r.on("getMuted",function(e){e(0===i.get("volume"))}),r.on("getLoop",function(e){e(i.get("loop"))}),r.on("setLoop",function(e){i.set("loop",e)})},playerjs.BetaJSAdapter.prototype.ready=function(){this.receiver.ready()};