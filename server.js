const express = require('express');
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ========================================
// Configuración
// ========================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (HTML, CSS, JS, imágenes)
app.use(express.static(__dirname));

// Configurar MercadoPago con tu Access Token (SDK v2)
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

console.log('✅ MercadoPago client configurado (v2)');

// ========================================
// Ruta principal - Servir index.html
// ========================================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ========================================
// Crear Preferencia de Pago
// ========================================
app.post('/create_preference', async (req, res) => {
    try {
        console.log('📝 Creando preferencia de pago...');

        const preference = new Preference(client);

        const result = await preference.create({
            body: {
                items: [
                    {
                        title: 'PulsePro Licencia Pro',
                        description: 'Suite empresarial completa con todas las funciones premium',
                        unit_price: 90000,
                        quantity: 1,
                        currency_id: 'COP'
                    }
                ],
                payer: {
                    email: req.body.email || 'cliente@pulsepro.com'
                },
                back_urls: {
                    success: `${process.env.BASE_URL}/success.html`,
                    failure: `${process.env.BASE_URL}/failure.html`,
                    pending: `${process.env.BASE_URL}/pending.html`
                },
                statement_descriptor: 'PULSEPRO',
                external_reference: 'PULSEPRO-' + Date.now(),
                notification_url: `${process.env.BASE_URL}/webhook`
            }
        });

        console.log('✅ Preferencia creada:', result.id);

        res.json({
            id: result.id,
            init_point: result.init_point,
            sandbox_init_point: result.sandbox_init_point
        });

    } catch (error) {
        console.error('❌ Error al crear preferencia:', error);
        res.status(500).json({
            error: 'Error al crear preferencia de pago',
            details: error.message
        });
    }
});

// ========================================
// Webhook - Recibir notificaciones de pago
// ========================================
app.post('/webhook', async (req, res) => {
    try {
        const { type, data } = req.body;
        // MercadoPago v2 webhook often sends topic/id in query or body differently.
        // Standard v2 check:
        const topic = req.query.topic || req.query.type;
        const id = req.query.id || req.query['data.id'];

        console.log('📬 Webhook recibido:', type || topic, id || data?.id);

        if (topic === 'payment' || type === 'payment') {
            const paymentId = id || data.id;
            const payment = new Payment(client);

            // Obtener información del pago
            const paymentInfo = await payment.get({ id: paymentId });

            console.log('💳 Pago ID:', paymentId);
            console.log('💰 Estado:', paymentInfo.status);
            console.log('💵 Monto:', paymentInfo.transaction_amount);

            if (paymentInfo.status === 'approved') {
                console.log('✅ PAGO APROBADO');
            }
        }

        res.sendStatus(200);
    } catch (error) {
        console.error('❌ Error en webhook:', error);
        res.sendStatus(500);
    }
});

// ========================================
// Rutas de retorno
// ========================================
app.get('/success', (req, res) => res.sendFile(path.join(__dirname, 'success.html')));
app.get('/failure', (req, res) => res.sendFile(path.join(__dirname, 'failure.html')));
app.get('/pending', (req, res) => res.sendFile(path.join(__dirname, 'pending.html')));

// ========================================
// Iniciar servidor
// ========================================
const PORT = process.env.PORT || 3000;
// Fallback para BASE_URL si no está definido en .env, útil para desarrollo local
if (!process.env.BASE_URL) {
    process.env.BASE_URL = `http://localhost:${PORT}`;
}

app.listen(PORT, () => {
    console.log('\n🚀 ========================================');
    console.log('🚀 Servidor PulsePro Backend (v2 SDK)');
    console.log('🚀 ========================================');
    console.log(`🌐 Servidor corriendo en: http://localhost:${PORT}`);
    console.log('🚀 ========================================\n');
});

// Manejo de errores no capturados
process.on('unhandledRejection', (error) => {
    console.error('❌ Error no manejado:', error);
});

module.exports = app;
