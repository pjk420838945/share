
/**
 * Module dependencies.
 */

var koa = require('koa');

var render = require('./lib/render'); //模板渲染
var logger = require('koa-logger'); //控制台日志
var route = require('koa-route'); //路径解析
var parse = require('co-body'); //参数解析

var app = koa();

// "database"
var mysql = require('mysql-co'); //数据库连接

var dbOption = {
  host: '10.138.230.24',
  port: '3702',
  user: 'le1ufljuce5lkn9y',
  password: '1bnazkee14dbd0mlkly03hsk19syp121',
  database: 'blog_rdi09gxrrljd8nry',
}

function *doDbConection( sql ) {
  var db = mysql.createConnection( dbOption );
  var result = yield db.query( sql );
  db.end();

  return result;
}

// var client = wrapper(pool);

// middleware

//logger
app.use( logger() );

// route middleware
app.use( route.get( '/', list ) );
app.use( route.get( '/post/new', add ) );
app.use( route.get( '/post/:id', show ) );
app.use( route.post( '/post', create ) );

// route definitions

app.on('error', function(err, ctx){
  log.error('server error', err, ctx);
});

/**
 * Post listing.
 */

function *list() {

  var articles = yield doDbConection( 'SELECT * FROM article' );

  var _data = {
    posts: articles[0]
  };

  _data.menuList = yield getMenu;

  this.body = yield render( 'list', _data );
}

function *getMenu() {

  var columns = yield doDbConection( 'SELECT * FROM acolumn' );

  return columns[ 0 ];
}

/**
 * Show creation form.
 */

function *add() {
  this.body = yield render( 'new' );
}

/**
 * Show post :id.
 */

function *show(id) {

  var article = yield doDbConection( 'SELECT * FROM article where id = ' + id );

  var post = article[0][0];
  if (!post) this.throw(404, 'invalid post id');
  this.body = yield render('show', { post: post });
}

/**
 * Create a post.
 */

function *create() {
  var post = yield parse(this);

  var articles =  yield doDbConection( 'INSERT INTO article ( title, content ) VALUES ( "' + post.title + '", "' + post.content + '" )' );

  this.redirect('/');
}

// listen
app.listen(3001);

console.log('listening on port 3001');