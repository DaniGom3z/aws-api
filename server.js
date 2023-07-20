const express = require('express')
const mysql = require('mysql');
const cors = require('cors');
const myconn = require('express-myconnection');
const routesProveedor = require('./routes/routesProveedor');
const routesMedicamentos = require('./routes/routesMedicamentos');
const routesCategorias = require('./routes/routesCategorias');
const app = express();

app.set('port', process.env.PORT || 9000);

const dbOptions = {

    host: 'bd-pi.cynxqnxbbipe.us-east-1.rds.amazonaws.com',
    port:3306,
    user: 'admin',
    password: 'danigomez123',
    database:'proyecto'
}

    


//middelwares--------------------------------------------
app.use(myconn(mysql,dbOptions,'single'));
app.use(express.json());
app.use(cors());


//rutas--------------------------------------------------
app.get('/',(req,res)=>{
    res.send('Bienvenido a la api')
})

app.use('/Medicamentos',routesMedicamentos)
app.use('/Categorias',routesCategorias)
app.use('/Proveedor',routesProveedor)


//Servidor corriendo--------------------------------------
app.listen(app.get('port'),()=>{
    console.log('server corriendo en el puerto', app.get('port'));
});
