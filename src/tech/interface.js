const VERSION = require('../../package.json').version;

class PlayerTechInterface {
  constructor(wrapperId, manifestUrl) {
    this.manifestUrl_ = manifestUrl;
    this.videoElement_ = null;
    this.wrapperElement_ = this.init_(wrapperId);

    this.eventListeners_ = {
      'playing': [],
      'paused': [],
      'muted': [],
      'unmuted': [],
    };
  }

  get version() {
    return VERSION;
  }

  get wrapper() {
    return this.wrapperElement_;
  }

  get isPlaying() {
    return !this.videoElement_.paused;
  }

  get isMuted() {
    return this.videoElement_.muted;
  }

  get isLive() {
    throw new Error('Missing implementation of isLive() property');
  }

  on(event, func) {
    this.eventListeners_[event].push(func);
  }

  play(startMuted) {
    if (startMuted) {
      this.videoElement_.muted = true;
    } else {
      this.videoElement_.muted = false;
    }
    let evname = this.videoElement_.muted ? 'muted' : 'unmuted';
    for(let f of this.eventListeners_[evname]) {
      f();
    }
    this.videoElement_.play();
  }

  pause() {
    this.videoElement_.pause();
  }

  mute() {
    this.videoElement_.muted = true;
  }

  unmute() {
    this.videoElement_.muted = false;
  }

  load() {
    return new Promise((resolve, reject) => {
      reject('Missing implementation of load() in player tech.');
    });
  }

  init_(wrapperId) {
    this.videoElement_ = document.createElement('video');
    this.videoElement_.className = 'eyevinn-player';
    let wrapperElement = document.getElementById(wrapperId);
    wrapperElement.appendChild(this.videoElement_);

    this.videoElement_.addEventListener('playing', event => {
      for(let f of this.eventListeners_['playing']) {
        f();
      }
    });

    this.videoElement_.addEventListener('pause', event => {
      for(let f of this.eventListeners_['paused']) {
        f();
      }
    });

    this.videoElement_.addEventListener('volumechange', event => {
      let evname = this.videoElement_.muted ? 'muted' : 'unmuted';
      for(let f of this.eventListeners_[evname]) {
        f();
      }
    });
    return wrapperElement;
  }  
}

module.exports = PlayerTechInterface;