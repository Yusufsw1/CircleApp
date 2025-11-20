import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().min(3).required().messages({
    "string.empty": "Username tidak boleh kosong",
    "string.min": "Username minimal 3 karakter",
    "any.required": "Username wajib diisi",
  }),

  name: Joi.string().min(3).required().messages({
    "string.empty": "Nama tidak boleh kosong",
    "string.min": "Nama minimal 3 karakter",
    "any.required": "Nama wajib diisi",
  }),
  email: Joi.string().email({ tlds: false }).required().messages({
    "string.empty": "Email tidak boleh kosong",
    "string.email": "Format email tidak valid",
    "any.required": "Email wajib diisi",
  }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "Password tidak boleh kosong",
    "string.min": "Password minimal 6 karakter",
    "any.required": "Password wajib diisi",
  }),
});

export const loginSchema = Joi.object({
  identifier: Joi.string().required().messages({
    "string.empty": "Identifier (username atau email) tidak boleh kosong",
    "any.required": "Identifier wajib diisi",
  }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "Password tidak boleh kosong",
    "string.min": "Password minimal 6 karakter",
    "any.required": "Password wajib diisi",
  }),
});
