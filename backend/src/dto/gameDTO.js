class GameCreateDTO {
  constructor(body) {
    this.title = body.title ? String(body.title).trim() : null;
    this.genre = body.genre ? String(body.genre).trim() : null;
    this.description = body.description ? String(body.description).trim() : null;
    this.image = body.image ? String(body.image).trim() : null;
  }
}

module.exports = {
  GameCreateDTO
};
