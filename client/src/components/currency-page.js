import { el, mount, router } from "redom";

export function createCurrencyPage() {
  let currencyBlocks = el("div", { class: "currency__blocks" });
  let currencyRoot = el("div", { class: "currency" }, [
    el("h2", { class: "currency__title title" }, "Валютный обмен"),
    currencyBlocks,
  ]);
  return { currencyRoot, currencyBlocks };
}
export function createCurrencyAccount(currency) {
  return el("div", { class: "currency__block currency__block_account" }, [
    el("h3", { class: "currency__subtitle" }, "Ваши валюты"),
    createCurrencyList(currency),
  ]);
}
export function createCurrencyList(currency) {
  let list = el("ul", { class: "currency__list" });
  currency.forEach((i) => {
    mount(list, createCurrencyItem(i.amount, i.code));
  });
  return list;
}
export function createCurrencyItem(currencyAmount, currencyCode) {
  return el("li", { class: "currency__item" }, [
    el("span", { class: "currency__attr" }, currencyCode),
    el("span", { class: "currency__dot" }),
    el("span", { class: "currency__value" }, currencyAmount),
  ]);
}
export function createCurrencyExchange(allCurrencies, token) {
  let inputFrom = el("select", {
    class: "currency__input currency__input_from input selectpicker",
  });
  let inputTo = el("select", {
    class: "currency__input currency__input_to input selectpicker",
  });
  let inputAmount = el("input", {
    class: "currency__input currency__input_amount input",
  });
  let btnChange = el(
    "button",
    {
      class: "currency__btn btn",
      type: "submit",
    },
    "Обменять"
  );

  let form = el(
    "form",
    {
      class: "currency__form",
    },
    [
      el("div", { class: "currency__form-flex" }, [
        el("div", { class: "currency__form-block" }, [
          el("span", { class: "currency__span" }, "ИЗ"),
          inputFrom,
        ]),
        el("div", { class: "currency__form-block" }, [
          el("span", { class: "currency__span" }, "В"),
          inputTo,
        ]),
        el(
          "div",
          { class: "currency__form-block currency__form-block_amount" },
          [el("span", { class: "currency__span" }, "СУММА"), inputAmount]
        ),
      ]),
      btnChange,
    ]
  );
  let currencyExchange = el(
    "div",
    { class: "currency__block currency__block_exchange" },
    [el("h3", { class: "currency__subtitle" }, "Обмен валюты"), form]
  );
  return {
    currencyExchange,
    inputFrom,
    inputTo,
    inputAmount,
    form,
  };
}

export function createCurrencyFeed() {
  return el("div", { class: "currency__block currency__block_feed" }, [
    el(
      "h3",
      { class: "currency__subtitle" },
      "Изменение курсов в реальном времени"
    ),
    // await createCurrencyListFeed(),
  ]);
}
export function createCurrencyListFeed(feed) {
  //   let feed = JSON.parse(localStorage.getItem("currencyFeed"));
  let list = el("ul", { class: "currency__list" });
  if (feed === null || feed === undefined) {
    feed = JSON.parse(localStorage.getItem("currencyFeed"));

    if (feed === null || feed === undefined) return list;
  }
  if (feed.length > 20) {
    feed = feed.slice(-20);
  }
  if (feed.length <= 20) feed;
  let value = Object.values(feed);
  value.forEach((i) => {
    mount(
      list,
      createCurrencyItemFeed(
        `${JSON.parse(i).from}/${JSON.parse(i).to}`,
        JSON.parse(i).rate,
        JSON.parse(i).change
      )
    );
    // createCurrencyListFeed(feed);
  });
  return list;
}
export function createCurrencyItemFeed(fromTo, rate, change) {
  let attr = el("span", { class: "currency__attr" }, fromTo);
  let dot = el("span", { class: "currency__dot" });
  let value = el("span", { class: "currency__value" }, rate);
  if (change > 0) {
    dot.classList.add("up");
    value.classList.add("up-arrow");
    if (dot.classList.contains("down")) {
      dot.classList.remove("down");
    }
    if (value.classList.contains("down-arrow")) {
      value.classList.remove("down-arrow");
    }
  } else if (change < 0) {
    dot.classList.add("down");
    value.classList.add("down-arrow");
    if (dot.classList.contains("up")) {
      dot.classList.remove("up");
    }
    if (value.classList.contains("up-arrow")) {
      value.classList.remove("up-arrow");
    }
  }
  return el("li", { class: "currency__item" }, [attr, dot, value]);
}
