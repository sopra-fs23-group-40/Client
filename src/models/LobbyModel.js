/**
 * Lobby model
 */
class LobbyModel {
    constructor(data = {}) {
        this.name = null;
        this.lobbyId = null;
        this.lobbyType = null;
        this.lobbyToken = null;
        Object.assign(this, data)
    }
}

export default LobbyModel;