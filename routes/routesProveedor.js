const express = require('express')
const routesProveedor = express.Router()



routesProveedor.get('/', (req, res)=>{
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)

        conn.query('SELECT * FROM proveedor', (err, rows)=>{
            if(err) return res.send(err)

            res.json(rows)
        })
    })
})

routesProveedor.get('/validar', (req, res) => {
    const { nombreProveedor } = req.query;
  
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
  
      conn.query('SELECT IDproveedor, Nombre FROM proveedor WHERE Nombre = ?', [nombreProveedor], (err, rows) => {
        if (err) return res.send(err);
  
        res.json(rows);
      });
    });
  });


routesProveedor.post('/', (req, res)=>{
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO proveedor set ?', [req.body], (err, rows)=>{
            if(err) return res.send(err);
            conn.query('ALTER TABLE proveedor DROP INDEX idx_Nombre, ADD FULLTEXT INDEX idx_Nombre (Nombre) VISIBLE', (err, result) => {
                if (err) return res.send(err);
                res.send('INSERTADO');
            });

        })
    })
})

routesProveedor.put('/:id',(req,res)=>{
    req.getConnection((err,conn)=>{
        if(err)return res.send(err)
        conn.query('UPDATE  proveedor set ? WHERE IDproveedor=?',[req.body,req.params.id],(err,rows)=>{
            if(err)return res.send(err);
            conn.query('ALTER TABLE proveedor DROP INDEX idx_Nombre, ADD FULLTEXT INDEX idx_Nombre (Nombre) VISIBLE', (err, result) => {
                if (err) return res.send(err);
                res.send('Proveedor actualizado');
            });

            
        })
    })
})


routesProveedor.delete('/:id', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send('error')
        conn.query('DELETE FROM proveedor WHERE IDproveedor = ?', [req.params.id], (err, rows) => {
            if (err) return res.send('erros');
            conn.query('ALTER TABLE proveedor DROP INDEX idx_Nombre, ADD FULLTEXT INDEX idx_Nombre (Nombre) VISIBLE', (err, result) => {
                if (err) return res.send(err);
                res.send('Proveedor eliminada');
            });

            
        });
    });
});

module.exports = routesProveedor;



