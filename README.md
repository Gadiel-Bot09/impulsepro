# PulsePro - Landing Page con MercadoPago 💳

Sistema completo de landing page para PulsePro con integración de pagos MercadoPago.

## 🚀 Inicio Rápido

### 1. Iniciar Servidor
```bash
npm start
```

### 2. Abrir en Navegador
```
http://localhost:3000
```

### 3. Probar Pago
- Navega a la sección "Precios"
- Click en "Comprar Ahora"  
- Usa las tarjetas de prueba (ver abajo)

## 💳 Tarjetas de Prueba

### ✅ APROBADA
```
Número: 5031 7557 3453 0604
CVV: 123
Vencimiento: 11/25
Titular: APRO
```

### ❌ RECHAZADA
```
Número: 5031 4332 1540 6351
CVV: 123
Vencimiento: 11/25
Titular: OTHE
```

## 📁 Estructura del Proyecto

```
Disparadaor Pro/
├── server.js           # Servidor backend Express
├── index.html          # Página principal
├── success.html        # Página pago exitoso
├── failure.html        # Página pago fallido
├── pending.html        # Página pago pendiente
├── styles.css          # Estilos
├── script.js           # JavaScript frontend
├── package.json        # Dependencias
├── .env                # Credenciales (NO SUBIR A GIT)
└── assets/             # Imágenes
```

## 🔧 Comandos

```bash
# Iniciar servidor
npm start

# Instalar dependencias (primera vez)
npm install

# Detener servidor
Ctrl + C
```

## 📞 Contacto

WhatsApp: +57 300 381 3533
Email: soporte@pulsepro.com

## 📄 Licencia

© 2025 SinuHub · Powered by AI
