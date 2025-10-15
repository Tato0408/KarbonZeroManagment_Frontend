import { sendRecoveryEmail } from '../services/others/usersService.js';
import * as Alerts from '../../utils/alerts.js'

document.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.getElementById('recoveryEmail');
  const sendCodeBtn = document.getElementById('sendCodeBtn');
  const emailSection = document.getElementById('emailSection');
  const recoverySection = document.getElementById('recoverySection');
  const updatePasswordBtn = document.getElementById('updatePasswordBtn');

  sendCodeBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();

    if (!email) {
      alert('Por favor, ingresa tu correo electrónico.');
      return;
    }
    try {
      // Llamar al backend para enviar el código
      const res = await sendRecoveryEmail(email);
      const data = await res.json();

      if (res.ok) {
        Alerts.showToastCloseInfo("Se ha enviado un código al correo ingresado.");

        // Guardamos el correo en localStorage para usarlo después
        localStorage.setItem('recoveryEmail', email);

        // Ocultar fase 1 y mostrar fase 2
        emailSection.classList.add('d-none');
        recoverySection.classList.remove('d-none');
        updatePasswordBtn.classList.remove('d-none');
      } else {
        alert(data.message || 'No se pudo enviar el código.');
      }
    } catch (err) {
      console.error('Error enviando el correo:', err);
      alert('Ocurrió un error al enviar el correo.');
    }
  });
});
