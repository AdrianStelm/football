const mongoose = require("mongoose");

const Schema = mongoose.Schema

const ArticleSchema = new Schema({
    title: { type: String, required: true},
    text: { type: String, required: true},
    author: { type: String, required: true},
    dateOfPublication: { type: Date},
    image: { type: [String]},
    likes: { type: Number, default: 0 },
    comments: {type: [Object]}

})

module.exports = mongoose.model("Article", ArticleSchema);