var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

//Conexión MOngoDB
mongoose.connect('mongodb://localhost/usuarios');

var email_match=[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Coloca un email valido"];

var password_validation={
	validator: function(p){
		return this.password_confirmation == p;
	},
	message: 'Las contraseñas no son iguales'
}

var user_schema = new Schema({
	nombre: String,
	apellido: String,
	username: {type: String, required: true,maxlength:[50,"Username es muy grande"]},
	email: {type: String, required: "El correo es obligatorio",match:email_match},
	password: {type:String,required: true,minlength:[8,"El password es muy corto"], validate: password_validation}

});

user_schema.virtual('password_confirmation').get(function(){
	return this.p_c;
	}).set(function(password){
		this.p_c = password;
	});
var User = mongoose.model('User',user_schema);
module.exports.User = User;