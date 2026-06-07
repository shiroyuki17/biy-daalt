const { GameCreateDTO } = require('../dto/gameDTO');
const { validateGameCreate } = require('../validators/validator');
const gameService = require('../services/gameService');

exports.getAllGames = async (req, res, next) => {
  try {
    const games = await gameService.getAllGames();
    return res.status(200).json({
      success: true,
      games
    });
  } catch (error) {
    next(error);
  }
};

exports.getGameById = async (req, res, next) => {
  try {
    const gameId = parseInt(req.params.id, 10);
    const game = await gameService.getGameById(gameId);
    return res.status(200).json({
      success: true,
      game
    });
  } catch (error) {
    next(error);
  }
};

exports.createGame = async (req, res, next) => {
  try {
    const dto = new GameCreateDTO(req.body);
    validateGameCreate(dto);

    const game = await gameService.createGame(dto);
    return res.status(201).json({
      success: true,
      message: 'Game created successfully.',
      game
    });
  } catch (error) {
    next(error);
  }
};

exports.updateGame = async (req, res, next) => {
  try {
    const gameId = parseInt(req.params.id, 10);
    const dto = new GameCreateDTO(req.body);

    const game = await gameService.updateGame(gameId, dto);
    return res.status(200).json({
      success: true,
      message: 'Game updated successfully.',
      game
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteGame = async (req, res, next) => {
  try {
    const gameId = parseInt(req.params.id, 10);
    const result = await gameService.deleteGame(gameId);
    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};
