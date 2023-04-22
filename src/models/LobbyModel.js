/**
 * Lobby model
 */
class LobbyModel {
    constructor(data = {}) {
        this.name = null;
        this.lobbyId = null;
        this.lobbyType = null;
        this.lobbyToken = null;
        this.playerList = null;
        Object.assign(this, data)
    }
}

export default LobbyModel;