import { el, mount } from "redom";
import Chart from "chart.js/auto";
import { router } from "../main";
// import { transferFunds } from "../api";
import { getCorrectDate, getCorrectMonth } from "../render";
// import Navigo from "navigo";
// const router = new Navigo('/')

export function createDetailPageHeader(
  titlePage,
  accountId,
  balance,
  router,
  href
) {
  return el("div", { class: "detail__header" }, [
    el("div", { class: "detail__block" }, [
      el("h2", { class: "detail__title detail__title_main title" }, titlePage),
      el("h3", { class: "detail__subtitle" }, `№ ${accountId}`),
    ]),
    el("div", { class: "detail__block" }, [
      el(
        "a",
        {
          class: "detail__btn btn",
          href: href,
          onclick(event) {
            event.preventDefault();
            router.navigate(event.target.getAttribute("href"));
          },
        },
        "Вернуться назад"
      ),
      el("div", { class: "detail__balance-block" }, [
        el("h3", { class: "detail__balance-title" }, "Баланс"),
        el("span", { class: "detail__balance" }, `${balance} ₽`),
      ]),
    ]),
  ]);
}
export function createDetailPage() {
  let main = el("div", { class: "detail" });
  return main;
}
export function createDetailHistoryPage() {
  return el("div", { class: "detail detail-history" });
}
export function createTransactions() {
  let inputTransactionAccount = el("input", {
    class: "transaction__account input input-to",
    placeholder: "Номер счета получателя",
  });
  let inputTransactionCash = el("input", {
    class: "transaction__account input input-amount",
    placeholder: "Сумма перевода",
  });
  let btnSendTransaction = el(
    "button",
    {
      class: "transaction__btn btn",
      type: "submit",
    },

    "Отправить"
  );
  let transactionForm = el("form", { class: "transaction__form" }, [
    inputTransactionAccount,
    inputTransactionCash,
    btnSendTransaction,
  ]);
  let transaction = el("div", { class: "detail__transaction transaction" }, [
    el("h3", { class: "transaction__title" }, "Новый перевод"),
    [transactionForm],
  ]);
  return {
    transaction,
    transactionForm,
    inputTransactionAccount,
    inputTransactionCash,
    btnSendTransaction,
  };
}
export function createTransactionsHistoryTable(
  transactionsData,
  count,
  accountId
) {
  const tbody = el("tbody", { class: "transaction-table__body" });
  let length = transactionsData.length;
  if (length > count) {
    let lastCountTransactin = transactionsData.slice(-count).reverse();
    lastCountTransactin.forEach((transaction) => {
      let transactionItem = convertationData(transaction, accountId);
      mount(tbody, transactionItem);
    });
  } else {
    transactionsData.forEach((transaction) => {
      let transactionItem = convertationData(transaction, accountId);
      mount(tbody, transactionItem);
    });
  }

  return el("div", { class: "detail__transaction-table transaction" }, [
    el("h3", { class: "transaction__title" }, "История переводов"),
    el("table", { class: "transaction-table" }, [
      el("thead", { class: "transaction-table__head" }, [
        el("tr", { class: "transaction-table__tr" }, [
          el("th", { class: "transaction-table__th" }, "Счет отправителя"),
          el("th", { class: "transaction-table__th" }, "Счет получателя"),
          el("th", { class: "transaction-table__th" }, "Сумма"),
          el("th", { class: "transaction-table__th" }, "Дата"),
        ]),
      ]),
      tbody,
    ]),
  ]);
}
export function convertationData(transaction, accountId) {
  if (accountId === transaction.from && transaction.to !== transaction.from) {
    return el("tr", { class: "transaction-table__item" }, [
      el("td", { class: "transaction-table__td" }, transaction.from),
      el("td", { class: "transaction-table__td" }, transaction.to),
      el(
        "td",
        { class: "transaction-table__td transaction-table__td_out" },
        `- ${transaction.amount} ₽`
      ),
      el(
        "td",
        { class: "transaction-table__td" },
        getCorrectDate(transaction.date)
      ),
    ]);
  } else if (
    accountId === transaction.to &&
    transaction.to !== transaction.from
  ) {
    return el("tr", { class: "transaction-table__item" }, [
      el("td", { class: "transaction-table__td" }, transaction.from),
      el("td", { class: "transaction-table__td" }, transaction.to),
      el(
        "td",
        { class: "transaction-table__td transaction-table__td_in" },
        `+ ${transaction.amount} ₽`
      ),
      el(
        "td",
        { class: "transaction-table__td" },
        getCorrectDate(transaction.date)
      ),
    ]);
  } else if (transaction.from === transaction.to) {
    return el("tr", { class: "transaction-table__item" }, [
      el("td", { class: "transaction-table__td" }, transaction.from),
      el("td", { class: "transaction-table__td" }, transaction.to),
      el(
        "td",
        { class: "transaction-table__td transaction-table__td_equal" },
        `счета равны ${transaction.amount} ₽`
      ),
      el(
        "td",
        { class: "transaction-table__td" },
        getCorrectDate(transaction.date)
      ),
    ]);
  }
}
export function createDetailCanvas(
  transactionsData,
  accountId,
  monthAgo,
  title,
  type
) {
  const detailCanvas = el("div", { class: "detail__canvas" }, [
    el("h3", { class: "transaction__title" }, title),
  ]);
  const canvas = el("canvas", { class: "detail__canvas-element" });

  detailCanvas.addEventListener("click", (event) => {
    event.preventDefault();
    router.navigate(`/account/${accountId}/detail`);
  });
  const countMonthsAgo = new Date();
  countMonthsAgo.setMonth(countMonthsAgo.getMonth() - monthAgo);

  let lastMonth = transactionsData.filter(
    ({ date }) => new Date(date) > countMonthsAgo
  );
  const arr = [];
  let arrMonth = [];
  let arrAmount = [];
  let arrIncr = [];
  let arrDecr = [];
  let arrIn = [];
  let arrOut = [];
  lastMonth.forEach((transaction) => {
    if (accountId === transaction.from && transaction.to !== transaction.from) {
      arr.push({
        date: getCorrectMonth(transaction.date),
        amount: -transaction.amount,
      });
    }
    if (accountId === transaction.to && transaction.to !== transaction.from) {
      arr.push({
        date: getCorrectMonth(transaction.date),
        amount: transaction.amount,
      });
    }
    if (transaction.from === transaction.to) {
      arr.push({
        date: getCorrectMonth(transaction.date),
        amount: 0,
      });
    }
  });
  let arrMonthAmount = [];
  arr.forEach((i) => {
    (arrMonthAmount[i.date] = arrMonthAmount[i.date] || []).push(i.amount);
  });
  Object.keys(arrMonthAmount).map((key) => arrMonth.push(key.slice(0, -5)));
  Object.values(arrMonthAmount).map((value) =>
    arrAmount.push(
      value.reduce((accumulator, a) => {
        return accumulator + Math.abs(a);
      }, 0)
    )
  );
  Object.values(arrMonthAmount).map((value) => {
    value.forEach((amount) => {
      if (amount > 0) {
        arrIncr.push(amount);
      } else if (amount <= 0) {
        arrDecr.push(amount);
      }
    });
    arrIn.push(
      arrIncr.reduce((accumulator, a) => {
        return accumulator + Math.abs(a);
      }, 0)
    );
    arrOut.push(
      arrDecr.reduce((accumulator, a) => {
        return accumulator + Math.abs(a);
      }, 0)
    );
  });

  let data;
  if (type === "in-out") {
    data = {
      labels: arrMonth,
      datasets: [
        {
          label: "Входящие транзакции",
          data: arrIn,
          borderColor: "#76CA66",
          backgroundColor: "#76CA66",
        },
        {
          label: "Исходящие транзакции",
          data: arrOut,
          borderColor: "#FD4E5D",
          backgroundColor: "#FD4E5D",
        },
      ],
    };
  } else {
    data = {
      labels: arrMonth,
      datasets: [
        {
          data: arrAmount,
          borderWidth: 1,
          borderColor: "transparent",
          backgroundColor: "#116ACC",
        },
      ],
    };
    data.datasets[0];
  }

  const chart = new Chart(canvas, {
    type: "bar",
    data: data,
    // options: options,
    options: {
      scales: {
        y: {
          beginAtZero: true,
          position: "right",
          grid: {
            dispaly: false,
          },
          // max: arrAmount.max(),
        },
        x: {
          // type: "linear",
          stacked: true,
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        borderWidth: 5,
        title: {
          display: true,
          color: "#222",
          padding: {
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          },
        },
      },
    },
  });
  mount(detailCanvas, canvas);
  return detailCanvas;
}
