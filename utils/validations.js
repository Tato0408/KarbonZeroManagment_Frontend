export function textValidation (e) {
  let char = String.fromCharCode(e.which); // la tecla presionada
  let regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]$/; // solo letras y espacios
  if (!regex.test(char)) {
    e.preventDefault(); // cancela la tecla
  }
}

export function emailValidation(e) {
  let char = String.fromCharCode(e.which); // la tecla presionada
  let regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.@\s]$/; // letras, números, punto, arroba y espacios
  if (!regex.test(char)) {
    e.preventDefault(); // cancela la tecla
  }
}

export function domainValidation (e) {

}

export function numberValidation (e) {
    let val = String.fromCharCode(e.which);
    let p = e.target.value;

    //Permitir numeros y punto
    if (!/[0-9.]/.test(val)) {
      e.preventDefault();
      return;
    }

    //Validacion para no permitir más de un punto de decimal
    if (val === "." && p.includes(".")) {
      e.preventDefault();
      return;
    }

    //No más de dos decimales después del punto
    if (p.includes(".")) {
      let parte = p.split(".");
      if (parte[1].length >= 2 && e.target.selectionStart > p.indexOf(".")) {
        e.preventDefault();
        return;
      }
    }
}