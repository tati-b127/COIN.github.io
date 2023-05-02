import { el } from "redom";
export function createAccountItem(accountId, balance, lastTransaction, router) {
  let btnOpenDetails = el(
    "a",
    {
      class: "account__btn btn",
      id: accountId,
      href: `/account/${accountId}`,
      onclick(event) {
        event.preventDefault();
        router.navigate(event.target.getAttribute("href"));
      },
    },
    "Открыть"
  );
  let accountItem = el("div", { class: "account__item" }, [
    el("h2", { class: "account__title title" }, `${accountId}`),
    el("h3", { class: "account__balance" }, `${balance} ₽`),
    el("div", { class: "account__block" }, [
      el("div", { class: "account__subblock" }, [
        el("h3", { class: "account__subtitle" }, "Последняя транзакция:"),
        el("span", { class: "account__date" }, `${lastTransaction}`),
      ]),
      btnOpenDetails,
    ]),
  ]);
  return { accountItem, btnOpenDetails };
}
export function createMainPage() {
  let title = el(
    "h2",
    { class: "account__title account__title_main title" },
    "Ваши счета"
  );
  let filter = el("select", { class: "account__filter filter" });
  let main = el("div", { class: "account__main" });
  let btnAddAccount = el(
    "button",
    { class: "account__btn btn" },
    "Создать новый счет"
  );
  let mainPage = el("div", { class: "account" }, [
    el("div", { class: "account__header" }, [title, filter, btnAddAccount]),
    main,
  ]);
  return {
    mainPage,
    filter,
    btnAddAccount,
    main,
  };
}
