/**
 * Base class for use cases.
 */
function UseCase() {
    if (this.constructor === UseCase)
        throw new Error("Cannot instantiate abstract class");

    this.name = "UseCase";
}

/**
 * Run the use case.
 */
UseCase.prototype.start = async function start() {
    console.log("Starting " + this.name + "...");

    try {
        return await this.run();
    } finally {
        console.log(this.name + " ends.");
    }
}

UseCase.prototype.run = async function() {
    throw new Error("Cannot call abstract method");
}

module.exports = UseCase;