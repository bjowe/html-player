class PlayerTechInterface {
  constructor(wrapperId, manifestUrl) {
    this.manifestUrl_ = manifestUrl;
    this.videoElement_ = null;
    this.wrapperElement_ = this.init_(wrapperId);

    this.eventListeners_ = {
      'playing': [],
      'paused': [],
    };
  }

  get wrapper() {
    return this.wrapperElement_;
  }

  get isPlaying() {
    return !this.videoElement_.paused;
  }

  on(event, func) {
    this.eventListeners_[event].push(func);
  }

  play(startMuted) {
    if (startMuted) {
      this.videoElement_.muted = true;
    }
    this.videoElement_.play();
  }

  pause() {
    this.videoElement_.pause();
  }

  load() {
    return new Promise((resolve, reject) => {
      reject('Missing implementation of load() in player tech.');
    });
  }

  init_(wrapperId) {
    this.videoElement_ = document.createElement('video');
    this.videoElement_.className = 'eyevinn-player';
    this.videoElement_.style = 'width: 100%';
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
    return wrapperElement;
  }  
}

module.exports = PlayerTechInterface;