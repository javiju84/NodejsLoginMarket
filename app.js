var express = require ("express");
var bodyParser = require ("body-parser");
var User = require ("./models/user").User;

var cookieSession = require ("cookie-session");
var router_app = require ("./routes_app");
var app = express();
var session_middleware = require("./middlewares/session");

app.use("/public",express.static("public"));
app.use(express.static("assets"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(cookieSession({
	name: "session",
	keys: ["llave-1","llave-2"]
}));
//app.set('views',__dirname + '/views');
app.set("view engine", "ejs");

app.get("/",function(req,res){
	console.log(req.session.user_id);
	res.render("inicio");
});

app.get("/register",function(req,res){
	User.find(function(err,doc){
		console.log(doc);
		res.render("register");
	});
});

app.get("/login",function(req,res){
	res.render("login");
});

app.post("/users",function(req,res){
	var user = new User({
		nombre: req.body.nombre,
		apellido: req.body.apellido,
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
		password_confirmation: req.body.password_confirmation
	});
	if (user.password !== '')
		console.log('Se puede crear usuario');
	user.save(function(err){
		if(err){
			console.log(String(err));
		}
	if (user.password !== '')
		res.redirect("/app");
	else
		res.redirect("/register")
	});
});
app.post("/sessions",function(req,res){
	User.findOne({username: req.body.username, password: req.body.password},function(err,user){
			req.session.user_id = user._id;
			res.redirect("/app");

		});
	});

app.use("/app",session_middleware);
app.use("/app",router_app);
app.listen(8888);
console.log('conexion puerto 8888');


