import { el } from "redom";
// import { createBtn } from "./btn.js";
import "../styles/header.scss";

export default function createHeader(router) {
  const btnBanks = el(
    "a",
    {
      class: "header__btn btn",
      href: "/banks",
      onclick(event) {
        event.preventDefault();
        router.navigate(event.target.getAttribute("href"));
      },
    },
    "Банкоматы"
  );
  const btnAccount = el(
    "a",
    {
      class: "header__btn btn",
      href: "/accounts",
      onclick(event) {
        event.preventDefault();
        router.navigate(event.target.getAttribute("href"));
      },
    },
    "Счета"
  );
  const btnCurrency = el(
    "a",
    {
      class: "header__btn btn",
      href: "/currency",
      onclick(event) {
        event.preventDefault();
        router.navigate(event.target.getAttribute("href"));
      },
    },
    "Валюты"
  );
  const btnExit = el(
    "a",
    {
      class: "header__btn btn",
      href: "/",
      onclick(event) {
        event.preventDefault();
        localStorage.removeItem("token");
        router.navigate(event.target.getAttribute("href"));
      },
    },
    "Выйти"
  );

  const title = el("h1", { class: "header__title" }, "Coin.");
  const headerNav = el("div", { class: "header__nav" }, [
    btnBanks,
    btnAccount,
    btnCurrency,
    btnExit,
  ]);

  const header = el("header", { class: "header" }, [title, headerNav]);
  // setChildren(header, headerNav);
  return {
    header,
    btnBanks,
    btnAccount,
    btnCurrency,
    btnExit,
    headerNav,
  };
}
