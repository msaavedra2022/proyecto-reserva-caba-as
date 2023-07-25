const { Op } = require("sequelize");
const { Reserva } = require("../models/models"); // Asegúrate de que la ruta al archivo de modelos sea correcta

const eliminarReservasNoConfirmadas = async () => {
    // Obtén la fecha actual menos 10 minutos
    const fechaLimite = new Date(new Date() - 10 * 60 * 1000);

    try {
        // Encuentra y elimina las reservas no confirmadas que fueron creadas hace más de 10 minutos
        const reservasEliminadas = await Reserva.destroy({
            where: {
                isConfirmed: false,
                isUploadedComprobante: false,
                createdAt: {
                    [Op.lt]: fechaLimite
                }
            }
        });

        console.log(`${reservasEliminadas} reservas eliminadas.`);
    } catch (error) {
        console.error(`Error al eliminar reservas: ${error}`);
    }
}

// Ejecuta esta función cada cierto intervalo
setInterval(eliminarReservasNoConfirmadas, 10 * 60 * 1000); // Ejecuta cada 10 minutos
