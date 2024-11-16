const pool = require('../models/Db.model');
exports.updateTokenPhone = async (req, res) => {
    const { token } = req.body;
    const { user } = req.params;
    const query = `UPDATE usuarios SET 
        token_telefono = ?
    WHERE id = ?`;
    
    pool.query(query, [token, user], (err) => {
        if (err) {
            return res.status(400).send({ message: 'Error al cambiar token de telefono' });
        }

        res.send({ message: 'Ok al cambiar token.'});
    });
  };
