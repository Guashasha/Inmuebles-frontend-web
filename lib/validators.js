const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
const PHONE_REGEX = /^\d{10}$/;
const RFC_REGEX =
  /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A-Z\d])$/;

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
