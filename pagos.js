<script>
    const Pi = window.Pi;
    // Cambiar sandbox: false cuando la app pase a Mainnet
    Pi.init({ version: "2.0", sandbox: true });

    const TASA_PI_COP = 648.81;

    const productosData = [
        { id: 1, nombre: "Licencia Digital Windows 11", desc: "Activación permanente para tu PC.", cop: 50000, icon: "💻" },
        { id: 2, nombre: "Pin Netflix 20.000 COP", desc: "Saldo para tu cuenta de streaming.", cop: 20000, icon: "🎟️" },
        { id: 3, nombre: "Audífonos Gamer", desc: "Sonido envolvente para consolas.", cop: 85000, icon: "🎧" },
        { id: 4, nombre: "Recarga BetPlay", desc: "Saldo inmediato para apuestas.", cop: 10000, icon: "⚽" },
        { id: 5, nombre: "Gestión SOAT Digital", desc: "Trámite rápido para tu vehículo.", cop: 450000, icon: "🚗" },
        { id: 6, nombre: "Recarga Movistar / Claro", desc: "Paquete de datos prepago.", cop: 5000, icon: "📶" }
    ];

    function renderProducts() {
        const container = document.getElementById('product-list');
        container.innerHTML = ""; // Limpiar antes de renderizar
        productosData.forEach(p => {
            const precioPi = (p.cop / TASA_PI_COP).toFixed(4);
            container.innerHTML += `
                <div class="product-card">
                    <div class="product-image">${p.icon}</div>
                    <div class="product-info">
                        <h3>${p.nombre}</h3>
                        <p>${p.desc}</p>
                        <div class="price-tag">
                            COP $${p.cop.toLocaleString('es-CO')}
                            <span class="pi-value">${precioPi} π</span>
                        </div>
                        <button class="buy-button" onclick="transferPi(${precioPi}, '${p.nombre}')">Comprar con Pi</button>
                    </div>
                </div>
            `;
        });
    }

    // --- LÓGICA DE AUTENTICACIÓN ---
    async function loginWithPi() {
        try {
            const scopes = ['username', 'payments', 'wallet_address'];
            const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
            
            document.getElementById('user-info').innerHTML = `
                <strong>Bienvenido, ${auth.user.username}</strong><br>
                <small>Listo para operar en Maxi Servicios</small>
            `;
            document.getElementById('pi-login').style.display = 'none';
        } catch (err) {
            alert("Error de autenticación. Asegúrate de estar en Pi Browser.");
            console.error(err);
        }
    }

    // --- LÓGICA DE PAGOS ---
    async function transferPi(amount, memo) {
        try {
            const payment = await Pi.createPayment({
                amount: parseFloat(amount),
                memo: memo, // Ej: "Pago de Licencia Windows 11"
                metadata: { 
                    productId: memo.replace(/\s+/g, '_').toLowerCase(),
                    app: "MaxiServicios_Store" 
                },
            }, {
                onReadyForServerApproval: async (paymentId) => {
                    console.log("Pago creado, esperando aprobación del servidor...");
                    // Aquí debes llamar a TU servidor para aprobar el pago
                    // fetch('/approve', { method: 'POST', body: JSON.stringify({ paymentId }) });
                },
                onReadyForServerCompletion: async (paymentId, txid) => {
                    console.log("Transacción realizada en la Blockchain:", txid);
                    alert("¡Gracias! Tu pago por " + memo + " ha sido procesado.");
                    // Aquí informas a tu servidor que el pago se completó
                },
                onCancel: (paymentId) => {
                    console.log("El usuario canceló el pago.");
                },
                onError: (error, payment) => {
                    console.error("Error en el pago:", error);
                },
            });
        } catch (err) {
            console.error("No se pudo iniciar el pago:", err);
        }
    }

    function onIncompletePaymentFound(payment) {
        console.log("Se encontró un pago no finalizado:", payment);
        // Lógica para completar pagos pendientes automáticamente si existieran
    }

    renderProducts();
</script>