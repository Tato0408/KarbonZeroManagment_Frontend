export function showInfo(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon
    });
}
export function showToastCloseSuccess(message) {
    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        showCloseButton: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'success',
        title: message,
        customClass: {
            popup: 'shadow-toast'
        }
    });
}
export function showToastCloseInfo(message) {
    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        showCloseButton: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'info',
        title: message,
        customClass: {
            popup: 'shadow-toast'
        }
    });
}
export function showToastCloseError(message) {
    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        showConfirmButton: false,
        showCloseButton: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        title: message,
        customClass: {
            popup: 'shadow-toast'
        }
    });
}
export function showToast(message, icon) {
    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        showConfirmButton: false,
        showCloseButton: true,
        timer: 3000,
        timerProgressBar: true,
        icon: icon,
        title: message,
        customClass: {
            popup: 'shadow-toast'
        }
    });
}