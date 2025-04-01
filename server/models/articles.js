const mongoose = require("mongoose");

const Schema = mongoose.Schema

const ArticleSchema = new Schema({
    title: { type: String, required: true},
    text: { type: String, required: true},
    author: { type: String, required: true},
    dateOfPublication: { type: Date, required: true },
    image: {data: Buffer,contentType: String}
})

module.exports = mongoose.model("Article", ArticleSchema);