const express = require('express');

const path = require('path');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/nodekb', {
   useNewUrlParser: true,
   useUnifiedTopology: true
 });



let db = mongoose.connection;

//=====Check Db Connection
db.once('open',function(){
    console.log('Connected to mongoDB');
});


//=====Check Db Error
db.on('error',function(err){
    console.log(err);
});




const app = express();


//====== bring in model for article============//

let Article = require('./models/article');

app.set('views',path.join(__dirname,'views'));

app.set('view engine','pug');

app.use(bodyParser.urlencoded({extended:false}))

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'public')));

//======home route
app.get('/', function(req,res){
   
Article.find({},function(err,articles){
if(err)
    {
        console.log(err);
    }
    else
        {
            res.render('index',{
                    title:'Article Test',
                    articles:articles        
                });
        }
});
    
});


//====== articles add route
app.get('/articles/add',function(req,res){
    res.render('add_articles',{
        title:'Add Articles'
    });
});


//====== Save New Article in DB======//

app.post('/articles/add',function(req,res)
{

    let article = new Article();

article.title = req.body.title;
article.author = req.body.author;

article.save(function(err){
if(err)
    {
        console.log(err);
        return;
    }
    else 
        {
            res.redirect('/');
        }

})
});


//==========Update Artice by Id=======//

app.post('/articles/edit/:id',function(req,res)
{

    let article = {};

article.title = req.body.title;
article.author = req.body.author;

let query = {_id:req.params.id};


Article.update(query,article,function(err){
if(err)
    {
        console.log(err);
        return;
    }
    else 
        {
            res.redirect('/');
        }

})
});



app.delete('/article/:id',function(req,res){

let query = {_id:req.params.id};

Article.remove(query,function(err){
    if(err)
        {
            console.log(err);
        }
        else
            {
                res.send('Success');
            }
});


})


//=======Load Edit ReadOnly Data=======//
app.get('/articles/:id',function(req,res){
    
 Article.findById(req.params.id,function(err,article){
 res.render('article',{
 article : article
 })
    
 });
});


//=======Load Edit Form=====
app.get('/articles/edit/:id',function(req,res){
    
 Article.findById(req.params.id,function(err,article){
 res.render('edit_article',{
     title:'Edit Article Page',
 article : article
 })
    
 });
});

app.listen(3000,function(){
    console.log('server started on port 3000.');
});