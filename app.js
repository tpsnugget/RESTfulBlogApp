var express = require('express'),
   app = express(),
   bodyParser = require('body-parser'),
   mongoose = require('mongoose'),
   methodOverride = require('method-override'),
   expressSanitizer = require('express-sanitizer')

mongoose.connect('mongodb://localhost:27017/restful_blog_app', { useNewUrlParser: true })

var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: { type: Date, default: Date.now }
})

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(expressSanitizer())

var Blog = mongoose.model('Blog', blogSchema)

//=================================================
//    ROUTES                           ============
//=================================================
app.get('/', (req, res) => {
   res.redirect('/blogs')
})

// INDEX ROUTE LISTS ALL BLOGS
app.get('/blogs', (req, res) => {
   Blog.find({}, (err, allBlogData) => {
      if (err) { console.log(err) }
      //                           ejs var    route var
      else { res.render('index', { blogs:     allBlogData }) }
   })
})

// NEW ROUTE SHOWS NEW BLOG FORM
app.get('/blogs/new', (req, res) => {
   res.render('new')
})

// CREATE ROUTE, CREATES NEW BLOG, THEN RE-DIRECTS SOMEWHERE
app.post('/blogs', (req, res) => {
   var data = req.body.blog
   var restrictedData = req.body.blog.body
   restrictedData = req.sanitize(restrictedData)
   Blog.create(data, (err, blog) => {
      if (err) { res.render('new') }
      else { res.redirect('blogs') }
   })
})

// SHOW ROUTE SHOWS INFO ABOUT ONE BLOG
app.get('/blogs/:id', (req, res) => {
   Blog.findById(req.params.id, (err, singleBlogData) => {
      if (err) { res.redirect('/blogs') }
      //                          ejs var    route var
      else { res.render('show', { e:         singleBlogData }) }
   })
})

// EDIT ROUTE SHOWS EDIT FORM FOR ONE BLOG
app.get('/blogs/:id/edit', (req, res) => {
   Blog.findById(req.params.id, (err, editSingleBlog) => {
      if (err) { res.redirect('/blogs') }
      //                          ejs var    route var
      else { res.render('edit', { e:         editSingleBlog }) }
   })
})

// UPDATE ROUTE UPDATES A PARTICULAR BLOG, THEN RE-DIRECTS SOMEWHERE
app.put('/blogs/:id', (req, res) => {
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, blogs) => {
      if (err) { res.redirect('/blogs') }
      else { res.redirect('/blogs/') }
   })
})

// DESTROY ROUTE, DESTROY A PARTICULAR BLOG
app.delete('/blogs/:id', (req, res) => {
   Blog.findByIdAndRemove(req.params.id, req.body.blog, (err) => {
      if (err) { res.redirect('/blogs') }
      else { res.redirect('/blogs/') }
   })
})
//=================================================
//    ROUTES                           ============
//=================================================
app.listen(3000, process.env.IP, () => {
   console.log('The server is running...')
})