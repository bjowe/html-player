const PlayerTechFactory = require('./player_tech_factory.js');
const PlayerSkin = require('./player_skin.js');

class Player {
  constructor(wrapperId, manifestUrl) {
    this.wrapperId_ = wrapperId;
    this.manifestUrl_ = manifestUrl;
    this.playerTechFactory_ = new PlayerTechFactory(this.wrapperId_, this.manifestUrl_);
  }

  init() {
    return new Promise((resolve, reject) => {
      this.playerTechFactory_.constructPlayerTech().then(player => {
        let skin = new PlayerSkin(player);
        skin.init().then(() => {
          resolve(player);
        });
      });
    });  
  }

}

module.exports = Player;