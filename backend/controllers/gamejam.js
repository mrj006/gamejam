const errorHandling = require("../configs/error");
const GameJam = require("../models/gamejam");
const User = require("../models/user");

module.exports = class Controller{
    static async getCurrentGameJam() {
        try {
            return await GameJam.findOne({}).sort('-_id');
        } catch(e) {
            errorHandling(e, res);
        }
    };

    static getCurrentGameJamRoute = async (req, res) => {
        try {
            let gamejam = await this.getCurrentGameJam();

            if (!gamejam) {
                return res.send({
                    message: "We couldn't find the information you are looking for.",
                    code: 404,
                });
            }

            return res.send({
                code: 200,
                data: [gamejam],
            });
        } catch(e) {
            errorHandling(e, res);
        }
    }

    static async getCurrentCategories() {
        try {
            return (await GameJam.findOne({}).sort('-_id')).categories;
        } catch(e) {
            console.log(e);
        }
    }

    static getCurrentCategoriesRoute = async (req, res) => {
        try {
            let categories = await this.getCurrentCategories();

            if (!categories) {
                return res.send({
                    message: "We couldn't find the information you are looking for.",
                    code: 404,
                });
            }

            return res.send({
                code: 200,
                data: categories,
            });
        } catch(e) {
            errorHandling(e, res);
        }
    };

    static async getCurrentCategory(_id) {
        try {
            return (await this.getCurrentGameJam()).categories.id(_id);
        } catch(e) {
            console.log(e);
        }
    }

    static async getCurrentThemes() {
        try {
            return (await GameJam.findOne({}).sort('-_id')).themes;
        } catch(e) {
            console.log(e);
        }
    }
    static getCurrentThemesRoute = async (req, res) => {
        try {
            let themes = await this.getCurrentThemes();

            if (!themes) {
                return res.send({
                    message: "We couldn't find the information you are looking for.",
                    code: 404,
                });
            }

            return res.send({
                code: 200,
                data: themes,
            });
        } catch(e) {
            errorHandling(e, res);
        }
    };

    static async getCurrentTheme(_id) {
        try {
            return (await this.getCurrentGameJam()).themes.id(_id);
        } catch(e) {
            console.log(e);
        }
    }

    static addGameJam = async (req, res) => {
        let {_id, description} = req.body;
        
        try {
            let user = await User.findById(req.user);

            if (!user.isGlobalOrg) {
                return res.send({
                    message: "You are not authorized to add GameJams!",
                    code: 403,
                });
            }

            let existingGameJam = await GameJam.findById(_id);

            if (existingGameJam) {
                return res.send({
                    message: "The provided GameJam already exists!",
                    code: 403,
                });
            }

            const gamejam = new GameJam({
                _id, 
                description,
            });

            await gamejam.save();

            return res.send({
                code: 200,
            });
        } catch(e) {
            errorHandling(e, res);
        }
    };

    static updateGameJam = async (req, res) => {
        let {_id, description} = req.body;

        try {
            let user = await User.findById(req.user);

            if (!user.isGlobalOrg) {
                return res.send({
                    message: "You are not authorized to add GameJams!",
                    code: 403,
                });
            }

            let gamejam = await GameJam.findById(_id);
            
            if (!gamejam) {
                return res.send({
                    message: "We could not find the provided GameJam!",
                    code: 404,
                });
            }

            gamejam.description = description;
            await gamejam.save();

            return res.send({
                code: 200,
            });
        } catch(e) {
            errorHandling(e, res);
        }
    };

    static deleteGameJam = async (req, res) => {
        let _id = req.body._id;

        try {
            let user = await User.findById(req.user);

            if (!user.isGlobalOrg) {
                return res.send({
                    message: "You are not authorized to add GameJams!",
                    code: 403,
                });
            }

            await GameJam.findByIdAndRemove(_id);

            return re.send({
                code: 200,
            });
        } catch(e) {
            errorHandling(e, res);
        }
    };
};