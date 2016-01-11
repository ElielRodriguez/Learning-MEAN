/*var http = require("http");
var fs = require("fs");
var path = require('path');*/

var express = require('express');
var app = express();
var mongoose = require('mongoose');

//Conexion a la base de datos
mongoose.connect("mongodb://localhost:27017/LearnMean",function(error)
{
    if(error) console.log(error.toString());
});

//Configuracion
app.configure(function ()
{
    // Localización de los ficheros estÃ¡ticos
    app.use(express.static(__dirname + '/public'));
    // Muestra un log de todos los request en la consola        
    app.use(express.logger('dev'));
    // Permite cambiar el HTML con el método POST                   
    app.use(express.bodyParser());
    // Simula DELETE y PUT                      
    app.use(express.methodOverride());
});

var Todo = mongoose.model('Todo', {  
    text: String
});

mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to mongodb://localhost:27017/LearnMean');
}); 

// Rutas de nuestro API
// GET de todos los TODOs
app.get('/api/todos', function(req, res) {  
    Todo.find(function(err, todos) {
        if(err) {
            res.send(err);
        }
        res.json(todos);
    });
});

// POST que crea un TODO y devuelve todos tras la creación
app.post('/api/todos', function(req, res) {  
    Todo.create({
        text: req.body.text,
        done: false
    }, function(err, todo){
        if(err) {
            res.send(err);
        }

        Todo.find(function(err, todos) {
            if(err){
                res.send(err);
            }
            res.json(todos);
        });
    });
});

// DELETE un TODO específico y devuelve todos tras borrarlo.
app['delete']('/api/todos/:todo', function(req, res) {  
    Todo.remove({
        _id: req.params.todo
    }, function(err, todo) {
        if(err){
            res.send(err);
        }

        Todo.find(function(err, todos) {
            if(err){
                res.send(err);
            }
            res.json(todos);
        });

    })
});

// Carga una vista HTML simple donde irá nuestra Single App Page
// Angular Manejará el Frontend
app.get('*', function(req, res) {  
    res.sendfile('./public/Index.html');                
});

// Escucha en el puerto 8080 y corre el server
app.listen(8081, function() {  
    console.log('Server running at http://127.0.0.1:8081');
});

