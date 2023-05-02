import { transferFunds } from "./api";

async function setLocalToken(token) {
  let localToken = localStorage.getItem("token");
  console.log(localToken);
  if (!localToken) {
    localStorage.setItem("token", token);
    localToken = localStorage.getItem("token");
  }
  console.log(localToken);
  return localToken;
}

function getLocalToken() {
  let localToken = localStorage.getItem("token");
  console.log(localToken);
  return localToken;
}
async function getLocalCurrencyFeed(title) {
  let localCurrencyFeed = JSON.parse(localStorage.getItem(title));
  if (!localCurrencyFeed) {
    localCurrencyFeed = [];
    localStorage.setItem(title, JSON.stringify(localCurrencyFeed));
  }
  return localCurrencyFeed;
}
async function setLocalCurrencyFeed(title, data) {
  let localCurrencyFeed = await getLocalCurrencyFeed(title);
  localCurrencyFeed.push(data);
  localStorage.setItem(title, JSON.stringify(localCurrencyFeed));
  return localCurrencyFeed;
}
async function getLocalTransferAccount(title) {
  let localTransfer = JSON.parse(localStorage.getItem(title));
  console.log(localTransfer);
  if (!localTransfer) {
    localTransfer = [];
    localStorage.setItem(title, JSON.stringify(localTransfer));
  }
  console.log(localTransfer);
  return localTransfer;
}
async function setLocalTransferAccount(title, data) {
  let localTransfer = await getLocalTransferAccount(title);
  if (localTransfer.includes(data)) {
    console.log("nashli takoe");
    localTransfer;
  } else {
    localTransfer.push(data);
  }
  localStorage.setItem(title, JSON.stringify(localTransfer));
  return localTransfer;
}
export {
  getLocalToken,
  setLocalToken,
  getLocalCurrencyFeed,
  setLocalCurrencyFeed,
  setLocalTransferAccount,
  getLocalTransferAccount,
};
