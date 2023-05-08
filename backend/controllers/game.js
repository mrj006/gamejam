const Game = require("../models/game");
const User = require("../models/user");

module.exports = class Controller {
  static findUsersByQuery = async (req, res) => {
    const query = req.query.user;
    try {
      const regex = new RegExp(`^${query}`, "i");
      const users = await User.find({ username: regex }).limit(10);

      if (!users || users.length === 0) {
        res.send({
          message: `No se encontraron usuarios que comiencen con '${query}'`,
          code: 404,
        });
        return;
      }

      res.send({
        message: `Usuarios que comienzan con '${query}':`,
        users,
        code: 200,
      });
    } catch (error) {
      console.error(
        `Error al buscar usuarios que comienzan con '${query}':`,
        error
      );
      res.send({
        message: `Error al buscar usuarios que comienzan con '${query}'`,
        code: 500,
      });
    }
  };

  static uploadFirstStage = async (req, res) => {
    let { gameName, teamName, responsible, teamMembers } = req.body;

    if (!(gameName && teamName && responsible && teamMembers)) {
      res.send({
        message: "You must fill all required fields!",
        code: 400,
      });

      return;
    }

    let existGameName = await Game.findById(gameName);
    if (existGameName) {
      res.send({
        message: "The name of the game is already registered!",
        code: 403,
      });

      return;
    }

    const game = new Game({
      _id: gameName,
      teamName,
      responsible,
      teamMembers,
    });

    game.save().then(() => {
      res.send({
        message: "Game registered!",
        code: 200,
      });
    });
  };
};
