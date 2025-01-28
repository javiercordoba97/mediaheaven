const db = require("../../database/models");

const controller = {
    list: async (req, res) => {
        let respuesta = {
            count: 0,
            users: []
        };
        let users = await db.Usuario.findAll();
        respuesta.count = users.length;
        respuesta.users = users.map(row => {
            return {
                id: row.id,
                name: row.nombre + " " + row.apellido,
                email: row.email,
                detail: "/api/user/detail/" + row.id
            };
        });
        res.json(respuesta);  // Corregido de req.json a res.json
    },
    detail: async (req, res) => {
        let user = await db.Usuario.findByPk(req.params.id, { attributes: { exclude: ["id_rol", "password"] } });
        let respuesta = {
            ...user.dataValues,  // Asegurarse de obtener los valores de los datos del usuario
            url_imagen: "img/users/" + user.img,
        };
        res.json(respuesta);  // Corregido de req.json a res.json
    },
};

module.exports = controller;