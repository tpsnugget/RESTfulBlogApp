var express       = require('express'),
    app           = express(),
    bodyParser    = require('body-parser')
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

app.get('/blogs', (req, res) => {
   Blog.find({}, (err, blogs) => {
      if (err) {console.log(err)}
      else {res.render('index', {blogs: blogs})}
   })
})

app.get('/blogs/new', (req, res) => {
   res.render('new')
})

app.post('/blogs', (req, res) => {
   var title = req.body.newTitle
   var newBlog = {title: title}
   Blog.create(newBlog, (err, blog) => {
      if (err) {console.log(err)}
      else {res.redirect('blogs')}
   })
})
//=================================================
//    ROUTES                           ============
//=================================================
app.listen(3000, process.env.IP, () => {
   console.log('The server is running...')
})