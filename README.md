# 🍽 La Esquina — Menú Online con MercadoPago

Demo funcional de menú gastronómico con carrito de compras e integración de pagos con MercadoPago Checkout Pro.

**Construido por [Emiliano Vega](mailto:vemiliano220@gmail.com) — Desarrollador web · Rosario, AR**

---

## Demo

> Abrí `public/index.html` en el navegador para ver el frontend.  
> Para activar el flujo de pago completo, necesitás configurar el servidor (ver abajo).

---

## Qué incluye

- **Menú con categorías** — filtro por entradas, principales, bebidas y postres
- **Carrito dinámico** — agregar, modificar cantidad y eliminar items en tiempo real
- **Checkout con MercadoPago** — redirige al checkout oficial de MP con los items del carrito
- **Páginas de resultado** — éxito, error y pago pendiente
- **Responsive** — adaptado para celular y desktop
- **Sin dependencias externas** — solo Node.js nativo + HTML/CSS/JS vanilla

---

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | HTML5, CSS3, JavaScript vanilla |
| Backend | Node.js (sin frameworks) |
| Pagos | MercadoPago Checkout Pro API |

---

## Configuración

### 1. Obtener credenciales de MercadoPago

1. Entrá a [mercadopago.com.ar/developers](https://mercadopago.com.ar/developers)
2. Creá o seleccioná una aplicación
3. Copiá el **Access Token de prueba** (empieza con `TEST-...`)

### 2. Configurar el servidor

Abrí `server.js` y reemplazá el token:

```js
const ACCESS_TOKEN = 'TEST-TU-TOKEN-AQUI';
```

### 3. Correr el servidor

```bash
node server.js
```

Abrí [http://localhost:3000](http://localhost:3000)

---

## Flujo de pago (modo prueba)

1. Usuario agrega items al carrito
2. Hace click en "Pagar con MercadoPago"
3. El frontend llama a `POST /create-preference` en el servidor
4. El servidor crea una preferencia en la API de MP y devuelve el link de checkout
5. Usuario es redirigido al checkout oficial de MercadoPago
6. Al terminar, MP redirige a `/success.html`, `/failure.html` o `/pending.html`

Para testear pagos en modo sandbox, usá las [tarjetas de prueba de MercadoPago](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-content/your-integrations/test/cards).

---

## Para llevar a producción

1. Reemplazar `ACCESS_TOKEN` por el token de **producción** (sin `TEST-`)
2. Actualizar `BASE_URL` con el dominio real
3. Cambiar `sandbox_init_point` por `init_point` en el frontend (`index.html`, función `checkout()`)
4. Activar HTTPS en el servidor

---

## Contacto

¿Querés este sistema para tu negocio?  
📧 vemiliano220@gmail.com  
📞 3405500324
