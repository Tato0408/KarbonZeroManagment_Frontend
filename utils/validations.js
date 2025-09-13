export function textValidation (e) {
  let char = String.fromCharCode(e.which); // la tecla presionada
  let regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]$/; // solo letras y espacios
  if (!regex.test(char)) {
    e.preventDefault(); // cancela la tecla
  }
}

export function domainValidation (e) {
  let val = String.fromCharCode(e.which);
  let p = e.target.value;

  // Permitir solo letras, números, puntos y guiones
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.-:/]/;
  if (!regex.test(val)) {
    e.preventDefault();
    return;
  }

  // No permitir que el primer carácter sea un guíon
  if (val === "-" && (!p || p[p.length - 1] === ".")) {
    e.preventDefault();
    return;
  }

  // No permitir que el último carácter sea un guión
  if (val === "." && p[p.length - 1] === "-") {
    e.preventDefault();
    return;
  }

  // No permitir 2 puntos seguidos
  if (val === "." && p[p.length - 1] === ".") {
    e.preventDefault();
    return;
  }

  // No permitir 2 puntos doblesseguidos
  if (val === ":" && p[p.length - 1] === ":") {
    e.preventDefault();
    return;
  }

  // No permitir 2 guiones seguidos
  if (val === "-" && p[p.length - 1] === "-") {
    e.preventDefault();
  }
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