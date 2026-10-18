// Client-side form validation. The server (Better Auth) validates again.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateName(value) {
  const v = (value ?? "").trim();
  if (!v) return "নাম লিখুন।";
  if (v.length < 2) return "নাম কমপক্ষে ২ অক্ষরের হতে হবে।";
  if (v.length > 60) return "নাম ৬০ অক্ষরের বেশি হতে পারবে না।";
  return "";
}

export function validateEmail(value) {
  const v = (value ?? "").trim();
  if (!v) return "ইমেইল লিখুন।";
  if (!EMAIL_RE.test(v)) return "সঠিক ইমেইল ঠিকানা লিখুন।";
  return "";
}

export function validatePassword(value, { min = 8 } = {}) {
  const v = value ?? "";
  if (!v) return "পাসওয়ার্ড লিখুন।";
  if (v.length < min) return "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।";
  return "";
}

/** Maps Better Auth error codes to Bengali messages. */
export function authErrorMessage(error) {
  const code = error?.code;
  const map = {
    USER_ALREADY_EXISTS: "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে।",
    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে।",
    INVALID_EMAIL_OR_PASSWORD: "ইমেইল বা পাসওয়ার্ড সঠিক নয়।",
    INVALID_PASSWORD: "পাসওয়ার্ড সঠিক নয়।",
    INVALID_EMAIL: "সঠিক ইমেইল ঠিকানা লিখুন।",
    PASSWORD_TOO_SHORT: "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।",
    PASSWORD_TOO_LONG: "পাসওয়ার্ড অনেক বড়।",
  };
  if (code && map[code]) return map[code];
  if (error?.status === 429) return "অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।";
  return "কিছু একটা ভুল হয়েছে। আবার চেষ্টা করুন।";
}
