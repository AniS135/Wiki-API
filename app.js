//jshint esversion:6

const express = require("express");
const bodyParser= require("body-parser");
const mongoose= require("mongoose");
const ejs = require("ejs");

const app= express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = new mongoose.Schema({
    title : {
        type : String
    },
    content : {
        type : String
    }
})

const Article = mongoose.model("Article", articleSchema);

// TODO

app.route("/articles")
    .get(function(req, res){
        Article.find(function(err, foundArticles){
            // console.log(foundArticles);
            if(err){
                res.send(err);
            }
            else{
                res.send(foundArticles);
            }
        });
    })
    .post(function(req, res){

        const newArticle = new Article({
            title : req.body.title,
            content : req.body.content
        });

        newArticle.save(function(err){
            if(!err){
                res.send("Succesfully added a new article.");
            } else{
                res.send(err);
            }
        });
    })
    .delete(function(req, res){
        Article.deleteMany(function(err){
            if(!err){
                res.send("Successfully deleted all articles.");
            } else {
                res.send(err);
            }
        });
    });


app.route("/articles/:articleTitle")
    .get(function(req, res){
        Article.findOne({title : req.params.articleTitle}, function(err, foundArticle){
            if(foundArticle){
                res.send(foundArticle);
            } else {
                res.send("No Article Matching that title was found");
            }
        })
    })
    .put(function(req, res){
        Article.updateOne(
            {title : req.params.articleTitle},
            {title : req.body.title, content: req.body.content},
            function(err){
                if(!err) {
                    res.send("Successfully updated article.");
                } else {
                    res.send(err);
                }
            }
        )
    })
    .patch(function(req, res){
        Article.updateOne(
            {title : req.params.articleTitle},
            {$set : req.body},
            function(err) {
                if(!err) {
                    res.send("Successfully updated article.")
                } else {
                    res.send(err);
                }
            }
        )
    })
    .delete(function(req, res){
        Article.deleteOne(
            {title : req.params.articleTitle},
            function(err){
                if(!err) {
                    res.send("Selected Article Deleted Successfully.")
                } else {
                    res.send(err);
                }
            }
        )
    });

app.listen(3000, function(){
    console.log(`Server started at http://localhost:3000`);
});
