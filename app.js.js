const Pi = window.Pi;
Pi.init({ version: "2.0" });

async function authenticateUser() {
    try {
        const scopes = ['username', 'payments'];
        const user = await Pi.authenticate(scopes, onIncompletePaymentFound);
        document.getElementById('user-display').innerText = `Hola, ${user.user.username}`;
    } catch (err) {
        console.error("Error de autenticación:", err);
    }
}

async function createPayment(productName, piAmount) {
    const payment = await Pi.createPayment({
        amount: piAmount,
        memo: `Compra de ${productName} en Maxiservicios Colombia`,
        metadata: { 
            app_id: "maxiservicios-col",
            github_repo: "pemorenoo/MaxiServicios"
        },
    }, {
        onReadyForServerApproval: (paymentId) => {
            console.log("Pago pendiente de aprobación:", paymentId);
            // Aquí llamarías a tu backend en cercia.co para aprobar el pago
        },
        onReadyForServerCompletion: (paymentId, txid) => {
            console.log("Pago completado con éxito:", txid);
            alert("¡Servicio activado! Revisa tu correo o cuenta de Maxiservicios.");
        },
        onCancel: (paymentId) => console.log("Usuario canceló el pago"),
        onError: (error, payment) => console.error("Error en transacción", error),
    });
}

function onIncompletePaymentFound(payment) {
    // Lógica para recuperar pagos interrumpidos
}

authenticateUser();