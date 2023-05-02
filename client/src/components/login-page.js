import { el } from "redom";

export function createLoginPage() {
  const inputLogin = el("input", {
    class: "login__input login__input_login input",
    type: "text",
    placeholder: "Введите логин",
    oninput(event) {
      event.preventDefault();
      inputLogin.classList.remove("error");
    },
  });
  const inputPassword = el("input", {
    class: "login__input login__input_password input",
    type: "password",
    placeholder: "Введите пароль",
    oninput(event) {
      event.preventDefault();
      inputPassword.classList.remove("error");
    },
  });
  const btnLogin = el(
    "button",
    { class: "login__btn btn", type: "submit" },
    "Войти"
  );
  const formLogin = el("form", { class: "login__form" }, [
    inputLogin,
    inputPassword,
    btnLogin,
  ]);

  const login = el("div", { class: "login" }, [
    el("h2", { class: "login__title title" }, "Вход в аккаунт"),
    formLogin,
  ]);
  return {
    login,
    formLogin,
    btnLogin,
    inputLogin,
    inputPassword,
  };
}
