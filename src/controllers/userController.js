const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require("../database/models");
const usuario = db.Usuario;

const userController = {
    register: async (req, res) => {
        res.render('users/register');
    },
    registerProcess: async (req, res) => {
        const resultValidation = validationResult(req);
        if (resultValidation.errors.length > 0) {
            return res.render('users/register', {
                errors: resultValidation.mapped(),
                oldData: req.body
            });
        }

        let usuarioNuevo = await usuario.create({
            "id": Date.now() + Math.round(Math.random() * 1E9),
            "img": req.file ? req.file.filename : "defaultUsers.png",
            "nombre": req.body.name,
            "apellido": req.body.last_name,
            "email": req.body.email,
            "contraseña": bcrypt.hashSync(req.body.password, 10),
            "telefono": req.body.telefono,
            "borrado": false,
            "id_rol": 2
        });

        res.redirect('/');
    },
    login: async (req, res) => {
        res.render('users/login');
    },
    loginProcess: async (req, res) => {
        let userToLogin = await usuario.findOne({ where: { email: req.body.email } });

        if (userToLogin) {
            if (bcrypt.compareSync(req.body.password, userToLogin.contraseña)) {
                // Se puede implementar lógica adicional aquí para manejar el inicio de sesión exitoso
                return res.redirect('/');
            } else {
                return res.render('users/login', {
                    errors: {
                        password: {
                            msg: 'La contraseña es incorrecta'
                        }
                    }
                });
            }
        } else {
            return res.render('users/login', {
                errors: {
                    email: {
                        msg: 'El email no está registrado'
                    }
                }
            });
        }
    },
    profile: async (req, res) => {
        let usuarioEncontrado = await usuario.findByPk(req.params.id, { paranoid: false });
        res.render('users/profile', { usuario: usuarioEncontrado });
    },
    edicionUsuario: async (req, res) => {
        let usuarioEncontrado = await usuario.findByPk(req.params.id);
        res.render('users/edicionUsuario', { usuario: usuarioEncontrado });
    },
    editarUsuario: async (req, res) => {
        let updateObj = {
            "img": req.file ? req.file.filename : "defaultUsers.png",
            "nombre": req.body.name,
            "apellido": req.body.last_name,
            "email": req.body.email,
            "telefono": req.body.telefono,
            "borrado": false
        };
        // Opcionalmente actualizar la contraseña si se envió
        if (req.body.password) {
            updateObj.contraseña = bcrypt.hashSync(req.body.password, 10);
        }
        await usuario.update(updateObj, { where: { id: req.params.id } });

        res.redirect('/profile/' + req.params.id);
    },
    deleteUsuario: async (req, res) => {
        await usuario.destroy({ where: { id: req.params.id } });
        res.redirect('/');
    }
};

module.exports = userController;