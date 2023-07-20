const express = require('express')
const routesMedicamentos = express.Router()

routesMedicamentos.get('/', (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);

    const query = `
      SELECT medicamentos.id_medicamento, medicamentos.NombreMedicina, medicamentos.Descripcion,
             medicamentos.NumeroDeLote, medicamentos.Cantidad, estados.Estado,
             medicamentos.FechaDeExpiracion, medicamentos.Precio, proveedor.Nombre,
             categorias.NombreCategorias
      FROM medicamentos
      INNER JOIN estados ON medicamentos.id_estado = estados.id_estado
      INNER JOIN categorias ON medicamentos.id_categorias = categorias.id_categoria
      INNER JOIN proveedor ON medicamentos.id_proveedores = proveedor.IDproveedor;
    `;
    conn.query(query, (err, rows) => {
      if (err) return res.send(err);

      res.json(rows);
    });
  });
});

routesMedicamentos.get('/validar/categoria',(req,res)=>{
  req.getConnection((err,conn)=>{
    if (err) return res.send(err);
    const query ='SELECT DISTINCT id_categorias From medicamentos';
    conn.query(query,(err,rows)=>{
      if(err) return res.send(err);
        res.json(rows)
    });
  });
});
routesMedicamentos.get('/validar/proveedor',(req,res)=>{
  req.getConnection((err,conn)=>{
    if (err) return res.send(err);
    const query ='SELECT DISTINCT id_proveedores FROM medicamentos';
    conn.query(query,(err,rows)=>{
      if(err) return res.send(err);
        res.json(rows)
    });
  });
});


  

routesMedicamentos.get('/ventas', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
  
      const query = 'SELECT id_medicamento, NombreMedicina, Medicamentos_vendidos FROM medicamentos WHERE Medicamentos_vendidos > 0';
      
      conn.query(query, (err, rows) => {
        if (err) return res.send(err);
  
        res.json(rows);
      });
    });
  });
  
  routesMedicamentos.post('/', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err);
        conn.query('INSERT INTO medicamentos SET ?', [req.body], (err, rows) => {
            if (err) return res.send(err);

            // Actualizar los índices
            const updateIndexesQuery = `
                ALTER TABLE medicamentos
                DROP INDEX proveedor_idx,
                DROP INDEX categoria_idx,
                DROP INDEX estado_idx,
                ADD INDEX proveedor_idx (id_proveedores),
                ADD INDEX categoria_idx (id_categorias),
                ADD INDEX estado_idx (id_estado)
            `;
            conn.query(updateIndexesQuery, (err, result) => {
                if (err) return res.send(err);

                res.send('INSERTADO');
            });
        });
    });
});

routesMedicamentos.put('/:id',(req,res)=>{
    req.getConnection((err,conn)=>{
        if(err)return res.send(err)
        conn.query('UPDATE  medicamentos set ? WHERE id_medicamento=?',[req.body,req.params.id],(err,rows)=>{
            if(err)return res.send(err)
            const updateIndexesQuery = `
                ALTER TABLE medicamentos
                DROP INDEX proveedor_idx,
                DROP INDEX categoria_idx,
                DROP INDEX estado_idx,
                ADD INDEX proveedor_idx (id_proveedores),
                ADD INDEX categoria_idx (id_categorias),
                ADD INDEX estado_idx (id_estado)
            `;
            conn.query(updateIndexesQuery, (err, result) => {
                if (err) return res.send(err);

                res.send('Medicamento actualizado');
            });
        });
    });
});
 
routesMedicamentos.delete('/:id', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send('error')
        conn.query('DELETE FROM medicamentos WHERE id_medicamento= ?', [req.params.id], (err, rows) => {
            if (err) return res.send('erros');
            const updateIndexesQuery = `
                ALTER TABLE medicamentos
                DROP INDEX proveedor_idx,
                DROP INDEX categoria_idx,
                DROP INDEX estado_idx,
                ADD INDEX proveedor_idx (id_proveedores),
                ADD INDEX categoria_idx (id_categorias),
                ADD INDEX estado_idx (id_estado)
            `;
            conn.query(updateIndexesQuery, (err, result) => {
                if (err) return res.send(err);

                res.send('Medicamento eliminado');
            });
        });
    });
});

module.exports = routesMedicamentos;