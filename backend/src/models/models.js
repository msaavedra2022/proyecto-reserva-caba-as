const Sequelize = require("sequelize");

const { PGUSER, PGHOST, PGDATABASE, PGPASSWORD, PGPORT } = require('dotenv').config().parsed;

console.log(PGUSER, PGHOST, PGDATABASE, PGPASSWORD, PGPORT);
const sequelize = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
    host: PGHOST,
    port: PGPORT,
    dialect: "postgres"
});

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
    contrasena: {
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
    fecha_inicio: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    fecha_fin: {
        type: Sequelize.DATE,
        allowNull: false,
    },
});

Usuario.hasMany(Reserva);
Reserva.belongsTo(Usuario);

Cabaña.hasMany(Reserva);
Reserva.belongsTo(Cabaña);

sequelize
    .sync({ force: false })
    .then(() => {
        console.log("Tablas creadas correctamente");
    })
    .catch((error) => {
        console.error("Error creando las tablas:", error);
    });

module.exports = {
    Usuario,
    Cabaña,
    Reserva,
};
