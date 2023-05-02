// import "babel-polyfill";
import "./styles/style.scss";
import { getLocalToken } from "./local.js";
import Navigo from "navigo";
export const router = new Navigo("/", { hash: true });
import {
  renderPage,
  renderLoginPage,
  renderMainPage,
  renderDetailPage,
  renderDetailHistoryPage,
  renderBanksPage,
  renderCurrencyPage,
} from "./render.js";

if (navigator.onLine) {
  console.log("Online");
} else {
  console.log("Offline");
}

router.on({
  "/": async () => {
    let loginPage = renderLoginPage();
    renderPage(loginPage);
  },
  "/accounts": async () => {
    let token = getLocalToken();
    let mainPage = await renderMainPage(token);
    renderPage(mainPage);
    let choicesInner = document.querySelector(".choices__inner");
    let choicesDropdorn = document.querySelector(".choices__list--dropdown");
    // choicesDropdorn.classList.add("closed");
    if (choicesInner.classList.contains("is-open")) {
      choicesDropdorn.classList.add("open");
    }
  },
  "/account/:id": async ({ data: { id } }) => {
    let token = getLocalToken();
    let detailPage = await renderDetailPage(token, id);
    renderPage(detailPage);
  },
  "/account/:id/detail": async ({ data: { id } }) => {
    let token = getLocalToken();
    let detailHistoryPage = await renderDetailHistoryPage(token, id);
    renderPage(detailHistoryPage);
  },
  "/banks": async () => {
    let banksPage = await renderBanksPage();
    renderPage(banksPage);
  },
  "/currency": async () => {
    let token = getLocalToken();
    let currencyPage = await renderCurrencyPage(token);
    renderPage(currencyPage);
  },
});
router.updatePageLinks();

router.resolve();

window.addEventListener("online", () => {
  console.log("Подключение восстановлено");
});
window.addEventListener("offline", () => {
  console.log("Произошла ошибка, проверьте подключение к интернету");
});
