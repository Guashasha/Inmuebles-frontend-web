const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
const PHONE_REGEX = /^\d{10}$/;
const RFC_REGEX =
  /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A-Z\d])$/;
const ZIP_CODE_REGEX = /^\d{5}$/;

export const validatePositiveNumber = (value, fieldName) => {
  if (value === "" || value === null || value === undefined) {
    return `El campo ${fieldName} es obligatorio.`;
  }
  if (isNaN(value) || Number(value) <= 0) {
    return `El campo ${fieldName} debe ser mayor a 0.`;
  }
  return null;
};

export const validateNonNegative = (value, fieldName) => {
  if (value === "" || value === null || value === undefined) {
    return `El campo ${fieldName} es obligatorio.`;
  }
  if (isNaN(value) || Number(value) < 0) {
    return `El campo ${fieldName} no puede ser negativo.`;
  }
  return null;
};

export const validateZipCode = (zip) => {
  if (!zip) return "El código postal es obligatorio.";
  if (!ZIP_CODE_REGEX.test(zip))
    return "El código postal debe tener 5 dígitos.";
  return null;
};

export const validateRequired = (value, fieldName) => {
  if (!value || value.toString().trim() === "") {
    return `El campo ${fieldName} es obligatorio.`;
  }
  return null;
};

export const validateEmail = (email) => {
  if (!email) return "El correo electrónico es obligatorio.";
  if (!EMAIL_REGEX.test(email)) return "Ingresa un correo electrónico válido.";
  return null;
};

export const validatePassword = (password) => {
  if (!password) return "La contraseña es obligatoria.";
  if (!PASSWORD_REGEX.test(password)) {
    return "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.";
  }
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return "El teléfono es obligatorio.";
  if (!PHONE_REGEX.test(phone))
    return "El teléfono debe tener 10 dígitos numéricos.";
  return null;
};

export const validateRFC = (rfc) => {
  if (!rfc) return "El RFC es obligatorio.";
  if (!RFC_REGEX.test(rfc.toUpperCase()))
    return "El formato del RFC no es válido.";
  return null;
};

export const validateAge18 = (dateString) => {
  if (!dateString) return "La fecha de nacimiento es obligatoria.";

  const birthDate = new Date(dateString);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  if (age < 18) {
    return "Debes ser mayor de 18 años para registrarte.";
  }

  if (age > 100) {
    return "La fecha de nacimiento no parece válida.";
  }

  return null;
};

export const validateForm = (data, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const value = data[field];
    const validationFn = rules[field];

    if (validationFn) {
      const error = validationFn(value);
      if (error) {
        errors[field] = error;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateRegisterData = (formData) => {
  const rules = {
    nombre: (val) => validateRequired(val, "nombre"),
    apellidos: (val) => validateRequired(val, "apellidos"),
    email: validateEmail,
    telefono: validatePhone,
    fechaNacimiento: validateAge18,
    rfc: validateRFC,
    password: validatePassword,
  };

  const result = validateForm(formData, rules);

  if (formData.password !== formData.confirmPassword) {
    result.errors.confirmPassword = "Las contraseñas no coinciden.";
    result.isValid = false;
  }

  return result;
};

export const validatePersonalData = (data) => {
  const rules = {
    nombre: (val) => validateRequired(val, "Nombre"),
    apellidos: (val) => validateRequired(val, "Apellidos"),
    telefono: validatePhone,
    nacionalidad: (val) => validateRequired(val, "Nacionalidad"),
    fechaNacimiento: (val) => validateRequired(val, "Fecha de nacimiento"),
    fechaNacimiento: validateAge18,
  };
  return validateForm(data, rules);
};

export const validateFiscalData = (data) => {
  const rules = {
    rfc: validateRFC,
  };
  return validateForm(data, rules);
};

export const validatePropertyBasicInfo = (propertyData) => {
  const errors = {};
  const { titulo, descripcion, subtipoId, detallesFisicos } = propertyData;

  const tituloError = validateRequired(titulo, "Título");
  if (tituloError) errors.titulo = tituloError;

  const descError = validateRequired(descripcion, "Descripción");
  if (descError) errors.descripcion = descError;

  if (!subtipoId)
    errors.subtipoId = "Debes seleccionar un subtipo de inmueble.";

  const supConstError = validatePositiveNumber(
    detallesFisicos.superficieConstruida,
    "Superficie construida"
  );
  if (supConstError) errors.superficieConstruida = supConstError;

  const supTotalError = validatePositiveNumber(
    detallesFisicos.superficieTotal,
    "Superficie total"
  );
  if (supTotalError) errors.superficieTotal = supTotalError;

  const antiguedadError = validateNonNegative(
    detallesFisicos.antiguedad,
    "Antigüedad"
  );
  if (antiguedadError) errors.antiguedad = antiguedadError;

  const recamarasError = validateNonNegative(
    detallesFisicos.numRecamaras,
    "Recámaras"
  );
  if (recamarasError) errors.numRecamaras = recamarasError;

  const banosError = validateNonNegative(detallesFisicos.numBaños, "Baños");
  if (banosError) errors.numBaños = banosError;

  if (!errors.superficieTotal && !errors.superficieConstruida) {
    if (
      Number(detallesFisicos.superficieConstruida) >
      Number(detallesFisicos.superficieTotal)
    ) {
      errors.superficieConstruida =
        "La construcción no puede ser mayor al terreno.";
    }
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validatePropertyLocation = (propertyData) => {
  const errors = {};
  const { direccion, geolocalizacion } = propertyData;

  const rules = {
    calle: (val) => validateRequired(val, "Calle"),
    ciudad: (val) => validateRequired(val, "Ciudad"),
    estado: (val) => validateRequired(val, "Estado"),
    codigoPostal: validateZipCode,
    noCalle: (val) => validateRequired(val, "Número exterior"),
    colonia: (val) => validateRequired(val, "Colonia"),
  };

  const direccionResult = validateForm(direccion, rules);

  if (!direccionResult.isValid) {
    Object.assign(errors, direccionResult.errors);
  }

  if (
    !geolocalizacion.latitud ||
    !geolocalizacion.longitud ||
    (geolocalizacion.latitud === 0 && geolocalizacion.longitud === 0)
  ) {
    errors.mapa = "Debes ubicar la propiedad en el mapa.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validatePropertyPublication = (propertyData) => {
  const errors = {};
  const pub = propertyData.publicacion;

  const precioError = validatePositiveNumber(pub.precio, "Precio");
  if (precioError) errors.precio = precioError;

  if (pub.depositoRequerido) {
    const depositoError = validatePositiveNumber(
      pub.montoDeposito,
      "Monto de depósito"
    );
    if (depositoError) errors.montoDeposito = depositoError;
  }

  if (pub.tipoOperacion === "Renta") {
    if (!pub.plazoMinimoMeses) {
      errors.plazoMinimoMeses = "Define un plazo mínimo.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateCard = (card) => {
  const cardRegex = /^\d{16}$/;
  if (!card) return "El número de tarjeta es obligatorio.";
  if (!cardRegex.test(card))
    return "Ingresa un número de tarjeta válido (16 dígitos).";
  return null;
};

export const validatePaymentMethodInfo = (type, details) => {
  let error = null;

  if (!details || details.trim() === "") {
    return {
      isValid: false,
      error: "Ingresa los detalles del método de pago.",
    };
  }

  if (type === "paypal" || type === "mercadopago") {
    error = validateEmail(details);
  } else if (type === "tarjeta") {
    error = validateCard(details);
  }

  return {
    isValid: error === null,
    error: error,
  };
};
