function errorHandlingAux(err) {
    let message;
    switch (err.name) {
        case "MongoServerError":
            if (err.message.split(" ")[0] == "E11000") {
                let start = err.message.indexOf("{");
                let end = err.message.indexOf("}") + 1;

                // JSON does not handle underscore when parsing
                let data = err.message.substring(start, end).replace("_id", "id");
            }

            return {
                code: 405,
                message: "Duplicated key!"
            }

        case "ValidationError":
            message = "The following attributes are not valid:\n";
            for (let key in err.errors) {
                let value = err.errors[key].value ? ", using the provided value: " + err.errors[key].value : ", as you did not provide a value!"; 
                message += err.errors[key].path + value + "\n";
            }
            return {
                code: 403,
                message,
            };
        default:
            console.log(err);
            return {
                code: 500,
                message: "An error occured while fetching information! Try again later."
            };
    }
};

function errorHandling(err, res) {
    let error = errorHandlingAux(err);
            
    return res.status(error.code).send(error);
}

module.exports = errorHandling;