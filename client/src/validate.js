export function validateLogin(login) {
  let reg = /^[a-z0-9_-]{6,16}$/;
  if (reg.test(login)) {
    return login;
  } else {
    throw new Error("Некорректное значение логина");
  }
}
export function validatePassword(password) {
  let reg = /^[a-z0-9_-]{6,16}$/;
  if (reg.test(password)) {
    return password;
  } else throw new Error("Некорректное значение пароля");
}
export function validateInputTo(value) {
  let number = /^[0-9]{14,26}$/;
  if (number.test(value)) {
    return value;
  } else if (value === null || value === undefined || value === "") {
    throw new Error("Некорректный счет");
  } else if (value <= 0) {
    throw new Error("Некорректный счет");
  } else throw new Error("Некорректный счет");
}
export function validateInputAmount(value) {
  let number = /^\d+$/;
  if (number.test(value)) {
    return value;
  } else if (value === null || value === undefined || value === "") {
    throw new Error("Сумма не корректна");
  } else if (value <= 0) {
    throw new Error("Отрицательная сумма");
  } else throw new Error("Сумма не корректна");
}
