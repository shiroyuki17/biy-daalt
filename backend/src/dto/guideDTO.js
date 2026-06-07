class GuideCreateDTO {
  constructor(body) {
    this.title = body.title ? String(body.title).trim() : null;
    this.content = body.content ? String(body.content).trim() : null;
    this.gameId = body.gameId ? parseInt(body.gameId, 10) : null;
  }
}

module.exports = {
  GuideCreateDTO
};
