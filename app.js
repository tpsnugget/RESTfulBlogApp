var express       = require('express'),
    app           = express(),
    bodyParser    = require('body-parser'),
    mongoose      = require('mongoose')

mongoose.connect('mongodb://localhost:27017/restful_blog_app', {useNewUrlParser: true})

var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type: Date, default: Date.now}
})

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))

var Blog = mongoose.model('Blog', blogSchema)

//=================================================
//    ROUTES                           ============
//=================================================
app.get('/', (req, res) => {
   res.redirect('/blogs')
})

// INDEX ROUTE
app.get('/blogs', (req, res) => {
   Blog.find({}, (err, blogs) => {
      if (err) {console.log(err)}
      else {res.render('index', {blogs: blogs})}
   })
})

// NEW ROUTE
app.get('/blogs/new', (req, res) => {
   res.render('new')
})

// CREATE ROUTE
app.post('/blogs', (req, res) => {
   var data = req.body.blog
   Blog.create(data, (err, blog) => {
      if (err) {res.render('new')}
      else {res.redirect('blogs')}
   })
})

// SHOW ROUTE
app.get('/blogs/:id', (req, res) => {
   Blog.findById(req.params.id, (err, blog) => {
      if (err) {res.redirect('/blogs')}
      else {res.render('show', {e: blog})}
   })
})
//=================================================
//    ROUTES                           ============
//=================================================
app.listen(3000, process.env.IP, () => {
   console.log('The server is running...')
})