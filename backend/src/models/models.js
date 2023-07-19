const Sequelize = require("sequelize");



require('dotenv').config();

const { PGUSER, PGHOST, PGDATABASE, PGPASSWORD, PGPORT } = process.env;

const sequelize = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
    host: PGHOST,
    port: PGPORT,
    dialect: "postgres"
});

sequelize.sync({ alter: true }) //TODO: Solo para desarrollo, borrar en producción

const Usuario = sequelize.define("usuario", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    apellido: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    celular: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});


const User = sequelize.define('User', {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});


const Cabaña = sequelize.define("cabaña", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    imagen: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    imagenes: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
    },
    ubicacion: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    capacidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    precio_por_noche: {
        type: Sequelize.DECIMAL,
        allowNull: false,
    },
});

const Reserva = sequelize.define("reserva", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    isConfirmed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    fecha_inicio: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    fecha_fin: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    nombre: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    celular: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    cantidad_personas: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
});

Usuario.hasMany(Reserva);
Reserva.belongsTo(Usuario);

Cabaña.hasMany(Reserva);
Reserva.belongsTo(Cabaña);

sequelize
    .sync({ force: false })
    .then(() => {
        console.log("Conexión con la base de datos establecida");
    })
    .catch((error) => {
        console.error("Error al conectar con la base de datos:", error);
    });

module.exports = {
    Usuario,
    Cabaña,
    Reserva,
    User
};
