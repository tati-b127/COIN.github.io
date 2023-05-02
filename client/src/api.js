import { setLocalToken } from "./local";
// const PORT=6060
const CLIENT_ORIGIN_URL = "http://localhost:3000/";
const WEBSOKET = "ws://localhost:3000/";

export async function getToken(login, password) {
  // const login = "developer";
  // const password = "skillbox";
  let token;
  let responce = await fetch(`${CLIENT_ORIGIN_URL}login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      login: login,
      password: password,
    }),
  });
  let data = await responce.json();
  if (responce.status === 200 && data.error === "" && data.payload !== null) {
    token = data.payload.token;
  } else throw new Error(data.error);
  if (data.error) return data.error;
  let localToken = await setLocalToken(token);
  return localToken;
}

export async function getAccounts(token) {
  let responce = await fetch(`${CLIENT_ORIGIN_URL}accounts/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${token}`,
    },
  });
  let data = await responce.json();
  let payloadData;
  if (responce.status === 200 && data.error === "" && data.payload !== null) {
    payloadData = data.payload;
  } else throw new Error(data.error);
  return {
    payloadData,
  };
}
export async function getAccountId(token, id) {
  let responce = await fetch(`${CLIENT_ORIGIN_URL}account/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${token}`,
    },
  });
  let data = await responce.json();
  let payloadData;
  if (responce.status === 200 && data.error === "" && data.payload !== null) {
    payloadData = data.payload;
  } else throw new Error(data.error);

  return {
    payloadData,
  };
}
export async function getNewAccount(token) {
  let responce = await fetch(`${CLIENT_ORIGIN_URL}create-account`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${token}`,
    },
  });
  let data = await responce.json();
}
export async function transferFunds(token, id, to, amount) {
  let responce = await fetch(`${CLIENT_ORIGIN_URL}transfer-funds`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${token}`,
    },
    body: JSON.stringify({
      from: id, // счёт с которого списываются средства
      to: to, // счёт, на который зачисляются средства
      amount: amount, // сумма для перевода
    }),
  });
  let data = await responce.json();
  if (responce.status === 200 && data.error === "" && data.payload !== null) {
    return data;
  } else throw new Error(data.error);
}
export async function getCurrencyAccounts(token) {
  return await fetch(`${CLIENT_ORIGIN_URL}currencies`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${token}`,
    },
  }).then((data) => data.json());
}

export async function getChangedCurrency() {
  return new WebSocket(`${WEBSOKET}currency-feed`);
}

export async function getAllCurrencies() {
  return await fetch(`${CLIENT_ORIGIN_URL}all-currencies`).then((data) =>
    data.json()
  );
}

export async function exchangeCurrency(from, to, amount, token) {
  return await fetch(`${CLIENT_ORIGIN_URL}currency-buy`, {
    method: "POST",
    body: JSON.stringify({
      from,
      to,
      amount,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${token}`,
    },
  }).then((res) => res.json());
}
export async function getBanks() {
  return await fetch(`${CLIENT_ORIGIN_URL}banks`).then((data) => data.json());
}
