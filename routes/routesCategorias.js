const express = require('express')
const routesCategorias = express.Router()



routesCategorias.get('/', (req, res)=>{
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)

        conn.query('SELECT * FROM categorias', (err, rows)=>{
            if(err) return res.send(err)

            res.json(rows)
        })
    })
})
routesCategorias.get('/validar', (req, res) => {
    const { nombreCategoria } = req.query;
  
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
  
      conn.query('SELECT id_categoria, NombreCategorias FROM categorias WHERE NombreCategorias = ?', [nombreCategoria], (err, rows) => {
        if (err) return res.send(err);
  
        res.json(rows);
      });
    });
  });
  

  routesCategorias.post('/', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err);
        conn.query('INSERT INTO categorias SET ?', [req.body], (err, rows) => {
            if (err) return res.send(err);
            conn.query('ALTER TABLE categorias DROP INDEX idx_NombreCategorias, ADD FULLTEXT INDEX idx_NombreCategorias (NombreCategorias) VISIBLE', (err, result) => {
                if (err) return res.send(err);
                res.send('INSERTADO');
            });
        });
    });
});



routesCategorias.put('/:id',(req,res)=>{
    req.getConnection((err,conn)=>{
        if(err)return res.send(err)
        conn.query('UPDATE  categorias set ? WHERE id_categoria=?',[req.body,req.params.id],(err,rows)=>{
            if(err)return res.send(err);
            conn.query('ALTER TABLE categorias DROP INDEX idx_NombreCategorias, ADD FULLTEXT INDEX idx_NombreCategorias (NombreCategorias) VISIBLE', (err, result) => {
                if (err) return res.send(err);
                res.send('Categoria actualizada');
            });
        })
    })
})


routesCategorias.delete('/:id', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send('error')
        conn.query('DELETE FROM categorias WHERE id_categoria= ?', [req.params.id], (err, rows) => {
            if (err) return res.send('erros');
            conn.query('ALTER TABLE categorias DROP INDEX idx_NombreCategorias, ADD FULLTEXT INDEX idx_NombreCategorias (NombreCategorias) VISIBLE', (err, result) => {
                if (err) return res.send(err);
                res.send('Categoria eliminada');
            });
        });
    });
});

module.exports = routesCategorias;