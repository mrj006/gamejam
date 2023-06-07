const GameJam = require("../models/gamejam");

module.exports = class Controller{
    static async getCurrentGameJam() {
        try {
            return await GameJam.findOne({}).sort('-_id');
        } catch(e) {
            console.log(e);
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
    static addGamejam = async (req, res) => {
        let {_id, desc} = req.body;
        try {
            const gamejam = new GameJam({
                _id, 
                password,
                description,
            });

            await gamejam.save();
            return res.send({
                message: "ya",
                code: 200,
                token: token,
            });
        } catch(e) {
            errorHandling(e, res);
        }
    };
};