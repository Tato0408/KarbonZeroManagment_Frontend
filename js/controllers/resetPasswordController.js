import { verifyRecoveryCode, putUserPassword} from '../services/others/usersService.js';
import * as Alerts from '../../utils/alerts.js'

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('passwordRecoveryForm');
  const codeInput = document.getElementById('recoveryCode');
  const newPasswordInput = document.getElementById('newPassword');
  const confirmPasswordInput = document.getElementById('confirmPassword');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const code = codeInput.value.trim();
    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    const email = localStorage.getItem('recoveryEmail'); // obtenemos el correo usado

    if (!code || !newPassword || !confirmPassword) {
      Alerts.showToastCloseError('Por favor, completa todos los campos.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alerts.showToastCloseError('Las contraseñas no coinciden.');
      return;
    }

    try {
      // Verificamos el código con el backend
      const verifyRes = await verifyRecoveryCode(email, code);
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        Alerts.showToastCloseError(verifyData.message || 'Código inválido o expirado.');
        return;
      }
      const id = verifyData.idUser;
      
      // Crear payload con los datos que el backend necesita
      const payload = {
        passwordUser: newPassword
      };

      const resetRes = await putUserPassword(id, payload);

      if (resetRes.ok) {
        Alerts.showToastCloseSuccess("Contraseña actualizada correctamente.");
        localStorage.removeItem('recoveryEmail');
        document.getElementById('passwordRecoveryModal').querySelector('form').reset();
        // Si querés cerrar el modal automáticamente:
        const modal = bootstrap.Modal.getInstance(document.getElementById('passwordRecoveryModal'));
        modal.hide();
      } else {
        Alerts.showToastCloseError(resetRes.data?.message || 'No se pudo actualizar la contraseña.');
      }

    } catch (err) {
      console.error('Error al actualizar contraseña:', err);
      Alerts.showToastCloseError('Ocurrió un error inesperado.');
    }
  });
});
