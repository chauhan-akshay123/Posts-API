let { DataTypes, sequelize } = require("../lib/index.js");

let post = sequelize.define("post", {
 title: DataTypes.TEXT,
 content: DataTypes.TEXT,
 author: DataTypes.TEXT
});

module.exports = { post };