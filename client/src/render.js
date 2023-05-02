import { mount, el, setChildren } from "redom";
import { router } from "./main.js";
import Choices from "choices.js";
import "./libs/choices.min.js";

import { Loader } from "@googlemaps/js-api-loader";
import { setLocalCurrencyFeed, setLocalTransferAccount } from "./local.js";
import { createMainPage, createAccountItem } from "./components/main-page";
import { createLoginPage } from "./components/login-page";
import {
  createDetailPage,
  createDetailHistoryPage,
  createTransactions,
  createDetailPageHeader,
  createDetailCanvas,
  createTransactionsHistoryTable,
} from "./components/detail-page";
import { createBanksPage } from "./components/banks-page.js";
import {
  getToken,
  getAccounts,
  getAccountId,
  getNewAccount,
  transferFunds,
  getBanks,
  getCurrencyAccounts,
  getChangedCurrency,
  getAllCurrencies,
  exchangeCurrency,
} from "./api";
import createHeader from "./components/header.js";
import {
  createCurrencyAccount,
  createCurrencyExchange,
  createCurrencyFeed,
  createCurrencyListFeed,
  createCurrencyPage,
} from "./components/currency-page.js";
import {
  validateInputAmount,
  validateInputTo,
  validateLogin,
  validatePassword,
} from "./validate.js";
export const countListTransaction = 10;
export const countListTransactionDetail = 25;
export const lastMonthAgo = 6;
export const lastYearAgo = 12;
const API = "AIzaSyCKqQjA7I5KHFisMuJGOLAPQscvpSGY7h8";

export function renderPage(page) {
  window.document.body.innerHTML = "";
  const root = el("main", { class: "root", id: "root" });
  const headerComponents = createHeader(router);
  const header = headerComponents.header;
  const headerNav = headerComponents.headerNav;

  if (router.matchLocation("/")) {
    headerNav.style.display = "none";
  } else {
    headerNav.style.display = "flex";
  }

  setChildren(root, page);
  mount(window.document.body, header);
  mount(window.document.body, root);
}
export async function getData(token, id) {
  if (id === undefined || id === null) {
    return await getAccounts(token);
  } else {
    return await getAccountId(token, id);
  }
}
export function sortItemAccount(data) {
  return data.sort((a, b) => parseFloat(a.account) - parseFloat(b.account));
}
export function sortItemBalance(data) {
  return data.sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));
}
export function sortItemTransaction(data) {
  let sorted = data.sort(
    (a, b) => b.transactions.length - a.transactions.length
  );
  return sorted.sort((a, b) => {
    if (a.transactions.length > 0 && b.transactions.length > 0)
      parseFloat(a.transactions[0].date) - parseFloat(b.transactions[0].date);
  });
}

export async function renderAllAccounts(mainRoot, token, sort) {
  let payloadData = await getData(token, null).then(
    (resolve) => resolve.payloadData
  );
  mainRoot.innerHTML = "";
  if (sort === null || sort === undefined) payloadData;
  if (sort === "number") {
    payloadData = sortItemAccount(payloadData);
  }
  if (sort === "balance") {
    payloadData = sortItemBalance(payloadData);
  }
  if (sort === "transactionDate") {
    payloadData = sortItemTransaction(payloadData);
  }
  payloadData.forEach((itemData) => {
    let accountId = itemData.account;
    let balance = itemData.balance;
    let lastTransaction = itemData.transactions;
    let lastTransactionDate;
    if (lastTransaction.length > 0) {
      lastTransaction.forEach((transaction) => {
        lastTransactionDate = getCorrectDate(transaction.date);
      });
    } else if (lastTransaction.length === 0) {
      lastTransactionDate = "Нет транзакций";
    }
    const item = createAccountItem(
      accountId,
      balance,
      lastTransactionDate,
      router
    );
    const accountItem = item.accountItem;

    mount(mainRoot, accountItem);
  });
  return mainRoot;
}

export function renderLoginPage() {
  const loginComponent = createLoginPage();
  let loginPage = loginComponent.login;
  const formLogin = loginComponent.formLogin;
  const inputLogin = loginComponent.inputLogin;
  const inputPassword = loginComponent.inputPassword;
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    const login = inputLogin.value;
    const password = inputPassword.value;
    let token;
    try {
      validateLogin(login);
      validatePassword(password);
      token = await getToken(login, password);
      inputLogin.classList.add("success");
      inputPassword.classList.add("success");
      router.navigate("/accounts");
    } catch (error) {
      if (
        error.message === "No such user" ||
        error.message === "Некорректное значение логина"
      )
        return inputLogin.classList.add("error");
      if (
        error.message === "Invalid password" ||
        error.message === "Некорректное значение пароля"
      )
        return inputPassword.classList.add("error");
    }
  });
  return loginPage;
}

export async function renderMainPage(token) {
  let mainComponent = createMainPage();
  let mainPage = mainComponent.mainPage;
  let mainRoot = mainComponent.main;
  const filter = mainComponent.filter;
  const choices = new Choices(filter, {
    searchChoices: false,
    placeholderValue: "Сортировка",
    isOpen: false,
    shouldSort: false,
  });
  choices.setChoices([
    { value: "", label: "Сортировка", selected: true },
    { value: "number", label: "По номеру" },
    { value: "balance", label: "По балансу" },
    { value: "transactionDate", label: "По последней транзакции" },
  ]);
  const btnAddAccount = mainComponent.btnAddAccount;
  let accounts = await renderAllAccounts(mainRoot, token);

  btnAddAccount.addEventListener("click", async (e) => {
    e.preventDefault();
    getNewAccount(token);
    accounts = await renderAllAccounts(mainRoot, token);
  });
  filter.addEventListener("change", async (e) => {
    e.preventDefault();
    const sort = filter.value;
    accounts = await renderAllAccounts(mainRoot, token, sort);
  });
  mount(mainPage, accounts);
  return mainPage;
}

export async function renderDetailPage(token, accountId) {
  let payloadData = await getData(token, accountId).then(
    (resolve) => resolve.payloadData
  );
  let allTransactions = payloadData.transactions;
  let balance = payloadData.balance;
  let detailPage = createDetailPage();
  let header = createDetailPageHeader(
    "Просмотр счета",
    accountId,
    balance,
    router,
    "/accounts"
  );
  let transaction = createTransactions();
  let canvas = createDetailCanvas(
    allTransactions,
    accountId,
    lastMonthAgo,
    "Динамика баланса"
  );
  let historyTable = createTransactionsHistoryTable(
    allTransactions,
    countListTransaction,
    accountId
  );
  let inputTo = transaction.inputTransactionAccount;
  let inputAmount = transaction.inputTransactionCash;
  let transactionForm = transaction.transactionForm;

  mount(detailPage, header);
  mount(detailPage, transaction.transaction);
  mount(detailPage, canvas);
  mount(detailPage, historyTable);

  transactionForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      validateInputTo(inputTo.value);
      validateInputAmount(inputAmount.value);
      let transfer = await transferFunds(
        token,
        accountId,
        inputTo.value,
        inputAmount.value
      );
      let transferLocal = await setLocalTransferAccount(
        "transfer",
        inputTo.value
      );
      console.log(transferLocal);
      detailPage.innerHTML = "";
      mount(
        detailPage,
        createDetailPageHeader(
          "Просмотр счета",
          accountId,
          transfer.payload.balance,
          router,
          "/accounts"
        )
      );
      mount(detailPage, createTransactions().transaction);
      mount(
        detailPage,
        createDetailCanvas(
          transfer.payload.transactions,
          accountId,
          lastMonthAgo,
          "Динамика баланса"
        )
      );
      mount(
        detailPage,
        createTransactionsHistoryTable(
          transfer.payload.transactions,
          countListTransaction,
          accountId
        )
      );
    } catch (error) {
      if (
        error.message === "Invalid account from" ||
        error.message === "Invalid account" ||
        error.message === "Invalid account to" ||
        error.message === "Некорректный счет"
      )
        return inputTo.classList.add("error");
      if (
        error.message === "Invalid amount" ||
        error.message === "Сумма не корректна" ||
        error.message === "Отрицательная сумма"
      )
        return inputAmount.classList.add("error");
      if (error.message === "Overdraft prevented")
        return inputAmount.classList.add("error");
    }
  });
  return detailPage;
}
export async function renderDetailHistoryPage(token, accountId) {
  let payloadData = await getData(token, accountId).then(
    (resolve) => resolve.payloadData
  );
  let allTransactions = payloadData.transactions;
  let balance = payloadData.balance;
  let detailHistoryPage = createDetailHistoryPage();
  let header = createDetailPageHeader(
    "История баланса",
    accountId,
    balance,
    router,
    `/account/${accountId}`
  );
  let canvasDinamic = createDetailCanvas(
    allTransactions,
    accountId,
    lastYearAgo,
    "Динамика баланса"
  );
  let canvasInOut = createDetailCanvas(
    allTransactions,
    accountId,
    lastYearAgo,
    "Соотношение входящих исходящих транзакций",
    "in-out"
  );
  let historyTable = createTransactionsHistoryTable(
    allTransactions,
    countListTransactionDetail,
    accountId
  );
  canvasDinamic.classList.add(
    "detail-history__canvas",
    "detail-history__canvas_dinamic"
  );
  canvasInOut.classList.add(
    "detail-history__canvas",
    "detail-history__canvas_in-out"
  );
  mount(detailHistoryPage, header);
  mount(detailHistoryPage, canvasDinamic);
  mount(detailHistoryPage, canvasInOut);
  mount(detailHistoryPage, historyTable);

  return detailHistoryPage;
}
export function getCorrectDate(isoDate) {
  let date = new Date(isoDate);
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  if (day < 10) day = "0" + day;
  if (month < 10) month = "0" + month;
  return `${day}.${month}.${year}`;
}
export function getCorrectMonth(isoDate) {
  let date = new Date(isoDate);
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  if (month < 10) {
    month = "0" + month;
  } else month = String(month);

  let objMonth = {
    Январь: "01",
    Февраль: "02",
    Март: "03",
    Апрель: "04",
    Май: "05",
    Июнь: "06",
    Июль: "07",
    Август: "08",
    Сентябрь: "09",
    Октябрь: "10",
    Ноябрь: "11",
    Декабрь: "12",
  };
  let m = Object.keys(objMonth).filter((k) => objMonth[k] === month);
  return `${m} ${year}`;
}
export async function renderBanksPage() {
  const banksData = await getBanks();
  const banksComponent = createBanksPage();
  const banksPage = banksComponent.banks;
  const banksMap = banksComponent.banksMap;
  const loader = new Loader({
    apiKey: API,
    // apiKey: "AIzaSyBnDRckHb83ElZJGp-X_FXCFPtfociuCBQ",
    version: "weekly",
    // ...additionalOptions,
  });

  loader.load().then(() => {
    const map = new google.maps.Map(banksMap, {
      center: { lat: 55.7540471, lng: 37.620405 },
      zoom: 12,
    });
    for (let i = 0; i < banksData.payload.length; i++) {
      const lat = banksData.payload[i].lat;
      const lng = banksData.payload[i].lon;

      let myLatlng = new google.maps.LatLng(lat, lng);
      let marker = new google.maps.Marker({
        position: myLatlng,
        title: "Coin.",
      });
      marker.setMap(map);
    }
  });
  return banksPage;
}
export async function renderCurrencyPage(token) {
  const currencyAccount = await getCurrencyAccounts(token);
  const allCurrencies = await getAllCurrencies();
  const socket = await getChangedCurrency();
  const currencyComponent = createCurrencyPage();
  let currencyRoot = currencyComponent.currencyRoot;
  let currencyBlocks = currencyComponent.currencyBlocks;
  let blockFeed = createCurrencyFeed();
  mount(blockFeed, createCurrencyListFeed());
  socket.onmessage = async function (event) {
    await setLocalCurrencyFeed("currencyFeed", event.data);
    let feed = JSON.parse(localStorage.getItem("currencyFeed"));
    mount(blockFeed, createCurrencyListFeed(feed));
  };
  const currency = currencyAccount.payload;
  let exchangeComponent = createCurrencyExchange(allCurrencies.payload, token);
  let exchangeBlock = exchangeComponent.currencyExchange;
  let exchangeForm = exchangeComponent.form;
  let inputFrom = exchangeComponent.inputFrom;
  let inputTo = exchangeComponent.inputTo;
  let inputAmount = exchangeComponent.inputAmount;
  const choicesFrom = new Choices(inputFrom, {
    searchChoices: false,
    isOpen: false,
    shouldSort: true,
  });
  const choicesTo = new Choices(inputTo);
  allCurrencies.payload.forEach((currency) => {
    choicesFrom.setValue([{ value: currency, label: currency }]);
  });
  allCurrencies.payload.forEach((currency) => {
    choicesTo.setValue([{ value: currency, label: currency }]);
  });

  exchangeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      let exchange = await exchangeCurrency(
        inputFrom.value,
        inputTo.value,
        inputAmount.value,
        token
      );
      let currency = exchange.payload;
      const currencyAccountNew = createCurrencyAccount(Object.values(currency));
      const blockFeedNew = createCurrencyFeed();
      router.navigate("/currency");
      currencyBlocks.innerHTML = "";
      mount(currencyBlocks, currencyAccountNew);
      mount(currencyBlocks, exchangeBlock);
      mount(blockFeedNew, createCurrencyListFeed());
      mount(currencyBlocks, blockFeedNew);

      if (exchange.payload === null || exchange.error !== null)
        throw new Error(exchange.error);
    } catch (error) {
      if (error.message === "Unknown currency code") {
        inputFrom.classList.add("error");
        inputTo.classList.add("error");
      }
      if (error.message === "Invalid amount")
        inputAmount.classList.add("error");
      if (
        error.message === "Not enough currency" ||
        error.message === "Overdraft prevented"
      )
        inputAmount.classList.add("error");
    }
  });
  mount(currencyBlocks, createCurrencyAccount(Object.values(currency)));
  mount(currencyBlocks, exchangeBlock);
  mount(currencyBlocks, blockFeed);

  // Object.values(currency),
  // allCurrencies.payload,
  // token
  // feed
  // JSON.parse(localStorage.getItem("currencyFeed"))
  return currencyRoot; //   let currencyAccount = currencyComponent.
}
