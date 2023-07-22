const express = require('express');
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
  port: 3306,
  user: 'admin',
  password: 'danigomez123',
  database: 'proyecto',
};

// Configurar la conexión a la base de datos con express-myconnection
app.use(myconn(mysql, dbOptions, 'single'));

// Middlewares
app.use(express.json());
app.use(cors());

// Rutas
app.get('/', (req, res) => {
  res.send('Bienvenido a la API');
});

app.use('/Medicamentos', routesMedicamentos);
app.use('/Categorias', routesCategorias);
app.use('/Proveedor', routesProveedor);

// Función para actualizar la cantidad de Medicamentos_vendidos
const actualizarMedicamentosVendidos = (conn) => {
  const updateQuery = 'UPDATE medicamentos SET Medicamentos_vendidos = 0';
  conn.query(updateQuery, (err, result) => {
    if (err) {
      console.error('Error al ejecutar la consulta de actualización:', err);
    } else {
      console.log('Se ha actualizado la cantidad de Medicamentos_vendidos a 0.');
    }
    conn.release(); // Liberar la conexión después de realizar la actualización
  });
};

// Tarea cron para llamar a la función de actualización
const cron = require('node-cron');
cron.schedule('0 0 1 * *', async () => {
  console.log("Running cron job to update Medicamentos_vendidos...");
  const pool = mysql.createPool(dbOptions); // Crear una nueva piscina de conexiones
  pool.getConnection((err, conn) => {
    if (err) {
      console.error('Error al conectar a la base de datos:', err);
      return;
    }
    actualizarMedicamentosVendidos(conn);
  });
});

// Servidor corriendo
app.listen(app.get('port'), () => {
  console.log('Servidor corriendo en el puerto', app.get('port'));
});
