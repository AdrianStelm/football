const Article = require('../../models/articles');
const User = require('../../models/user')

class newsController{
    async createArticle(req, res) {
        try {
            const { title, text, author} = req.body;
            const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
            const article = new Article({ title, text, image: imagePath, author, dateOfPublication: new Date() });
            await article.save()
            return res.status(200).json({ messagge: 'Article has created' })
        } catch (error) { 
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }
    async editArticle(req, res) {
        try {
            const id = req.params.id;
            const { newTitle, newText, newAuthor } = req.body;
            const newImage = req.file ? `/uploads/${req.file.filename}` : undefined;
            const article = await Article.findOne({ _id: id })

            if (newTitle == undefined) newTitle = article.title;
            if (newText == undefined) newText = article.text;
            if (newImage == undefined) newImage = article.image;
            if (newAuthor == undefined) newAuthor = article.author;

            article.title = newTitle;
            article.text = newText;
            await Article.updateOne({ _id: id }, { $push: { image: { newImage } } })
            article.author = newAuthor;
            article.dateOfPublication = new Date();

            await article.save()
            return res.status(200).json({ message: 'Article was edited' });
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: error.message });
        }
    }
    async deleteArticle(req, res) {
        try {
            const id = req.params.id;
            const article = await Article.findOne({ _id: id });
            if (!article) {
                return res.status(404).json({ message: 'Article not found' });
            }
            await Article.deleteOne({ id });
            await article.save();

            return res.status(200).json({ message: 'Article deleted' });
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: error.message });
        }
    }
    async likeArticle(req, res) {
        try {
            const id = req.params.id;
            const { email } = req.body;
            const isLikedByUser = await User.findOne({ email, likedArticles: id });
            if (isLikedByUser) return res.status(403).json({ message: 'Article is already liked' });

            const likedArticle = await Article.findByIdAndUpdate(
                id,
                { $inc: { likes: 1 } },
                { new: true } 
             );
        if (!likedArticle) {
            return res.status(404).json({ message: 'Article not found' });
        }
            
        await User.updateOne({ email},{ $addToSet: { likedArticles: id}});
        return res.status(200).json({ message: 'Article was liked' });
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }
    async getArticle(req, res) {
        try {
            const id = req.params.id;
            const article = await Article.findOne({ _id: id});

            if (!article) {
                return res.status(404).json({ message: 'Article not found' });
            }
            return res.status(200).json({ title: article.title, text: article.text, author: article.author, image: article.image, date: article.date });
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: error.message });
        }
    }
    async getArticles(req, res) {
        try {
            const type = req.query.type || "default";
            const articles = await Article.find()
            switch (type) {
                case "last 5":
                    const lastFiveArticles = await Article.find().sort({ dateOfPublication: -1 }).limit(5);
                    return res.status(200).json(lastFiveArticles);
                case "popular last 5":
                    const popularFiveArticles = await Article.find().sort({ likes: -1 }).limit(5);
                    return res.status(200).json(popularFiveArticles);
                default:
                    return res.status(200).json(articles);
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }
    async writeComment(req, res) {
        try {
            let comment = {
                author:req.body.author,
                comment: req.body.commentText,
                dateOfWriting: new Date()
            }

            const id = req.params.id;
            const article = await Article.findOne({ _id: id});

            if (!article) {
                return res.status(404).json({ message: 'Article not found' });
            }
            await Article.updateOne({ _id: id }, { $push: { comments: { comment } } })
             await article.save()
            return res.status(200).json({ message: 'Comment was succesfully added'})

        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new newsController();
