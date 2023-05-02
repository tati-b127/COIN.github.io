/// <reference types="cypress" />
const login = "developer";
const password = "skillbox";
const invalidLogin = "lo g!";
const invalidPassword = " jk5*";
const URL = "http://localhost:8080";
describe("Тест авторизации приложения COIN", () => {
  beforeEach(() => {
    cy.visit(URL);
  });
  it("На странице имеется форма для авторизации", () => {
    cy.get(".login");
    cy.get(".login__input").should("have.length", "2");
    cy.get(".login__btn");
    cy.get(".header__nav").should("be.not.visible");
  });
  it("Ввод некорректного логина", () => {
    cy.get(".login__input_login").type(invalidLogin);
    cy.get(".login__input_password").type(password);
    cy.get(".login__btn").click();
    cy.get(".login__input_login").should("have.class", "error");
  });
  it("Ввод некорректного пароля", () => {
    cy.get(".login__input_login").type(login);
    cy.get(".login__input_password").type(invalidPassword);
    cy.get(".login__btn").click();
    cy.get(".login__input_password").should("have.class", "error");
  });
  it("Ввод корректного логина и пароля", () => {
    cy.get(".login__input_login").type(login);
    cy.get(".login__input_password").type(password);
    cy.get(".login__btn").click();
    cy.get(".login__input_login").should("have.class", "success");
    cy.get(".login__input_password").should("have.class", "success");
  });
  it("Вход в аккаунт пользователя", () => {
    cy.get(".login__input_login").type(login);
    cy.get(".login__input_password").type(password);
    cy.get(".login__btn").click();
    cy.get(".account__main").should("be.visible");
    cy.get(".header__nav").should("be.visible");
    cy.get(".account__item").should("be.visible");
    cy.get(".choices").should("be.visible");
  });
});
describe("Тест главной страницы", () => {
  beforeEach(() => {
    cy.visit(URL);
    cy.get(".login__input_login").type(login);
    cy.get(".login__input_password").type(password);
    cy.get(".login__btn").click();
  });
  it("Проверка сортировки счетов", () => {
    cy.hash().should("eq", "#/accounts");
    cy.get(".choices").should("be.visible").click();
    cy.get(".choices__item").contains("По номеру").click();
    cy.get(".choices").should("be.visible").click();
    cy.get(".choices__item").contains("По балансу").click();
    cy.get(".choices").should("be.visible").click();
    cy.get(".choices__item").contains("По последней транзакции").click();
  });
  it("Добавление нового счета", () => {
    cy.hash().should("eq", "#/accounts");
    cy.get(".account__main").children().last().as("amount");
    cy.get(".account__btn").last().invoke("attr", "id").as("lastBtnID");
    cy.log("@lastBtnID");
    cy.contains("Создать новый счет").click();
    cy.intercept({
      method: "POST",
      url: "http://localhost:3000/create-account",
    }).as("getAccount");
    cy.reload();
    cy.get(".account__item").should("be.visible");
    cy.get(".account__main").children().last().as("amountAccountAdd");

    function compare(a, b) {
      if (a === b) cy.log(a, b, "equal");
      if (a !== b) cy.log(a, b, "not equal");
    }

    compare(cy.get("@amount"), cy.get("@amountAccountAdd"));
  });
});
describe("Тест детальной страницы аккаунта", () => {
  const transferTo = "17761870722221556852070781";
  const transferAmount = "200";
  // const transferToError = "27 42254/54&53860";
  const transferToError = "12 000 344";
  const transferAmountError = "-200";
  const banks = "#/banks";
  const accounts = "#/accounts";
  const currency = "#/currency";
  const autorization = "#/";
  let hrefAccount;

  beforeEach(() => {
    cy.visit(URL);
    cy.get(".login__input_login").type(login);
    cy.get(".login__input_password").type(password);
    cy.get(".login__btn").click();
    cy.hash().should("eq", "#/accounts");
    cy.get(".account__btn").contains("Открыть").first().as("firstAccount");
    cy.get("@firstAccount")
      .invoke("attr", "href")
      .then((href) => {
        hrefAccount = `#${href}`;
        cy.log(href);
        cy.log(hrefAccount);
      });
    cy.get("@firstAccount").click();
  });
  it("Проверка перевода средств на другой счет", () => {
    cy.hash().should("eq", hrefAccount);
    cy.get(".transaction__form").should("be.visible");
    cy.get(".input-to").type(transferTo);
    cy.get(".input-amount").type(transferAmount);
    cy.get("form").submit();
    cy.get(".input-to").should("not.have.class", "error").and("have.value", "");
    cy.get(".input-amount")
      .should("not.have.class", "error")
      .and("have.value", "");
  });
  it("Проверка перевода средств на некорректный счет", () => {
    cy.hash().should("eq", hrefAccount);
    cy.get(".transaction__form").should("be.visible");
    cy.get(".input-to").type(transferToError);
    cy.get(".input-amount").type(transferAmount);
    cy.get("form").submit();
    cy.get(".input-to")
      .should("have.class", "error")
      .and("have.value", transferToError);
    cy.get(".input-amount")
      .should("not.have.class", "error")
      .and("have.value", transferAmount);
    cy.get(".input-to").clear().type(transferTo);
    cy.get("form").submit();
    cy.get(".input-to").should("not.have.class", "error").and("have.value", "");
    cy.get(".input-amount")
      .should("not.have.class", "error")
      .and("have.value", "");
  });
  it("Проверка некорректного перевода суммы", () => {
    cy.hash().should("eq", hrefAccount);
    cy.get(".transaction__form").should("be.visible");
    cy.get(".input-to").type(transferTo);
    cy.get(".input-amount").type(transferAmountError);
    cy.get("form").submit();
    cy.get(".input-to")
      .should("not.have.class", "error")
      .and("have.value", transferTo);
    cy.get(".input-amount")
      .should("have.class", "error")
      .and("have.value", transferAmountError);
    cy.get(".input-amount").clear().type(transferAmount);
    cy.get("form").submit();
    cy.get(".input-to").should("not.have.class", "error").and("have.value", "");
    cy.get(".input-amount")
      .should("not.have.class", "error")
      .and("have.value", "");
  });
  it("Проверка кнопки возврата на главную страницу, переход к истории баланса, навигаци", () => {
    cy.hash().should("eq", hrefAccount);
    cy.get(".detail__canvas").click();
    cy.hash().should("eq", hrefAccount + "/detail");
    cy.get(".detail-history__canvas_dinamic").should("be.visible");
    cy.get(".detail-history__canvas_in-out").should("be.visible");
    cy.get(".detail__btn").should("have.text", "Вернуться назад").click();
    cy.hash().should("eq", hrefAccount);
    cy.contains("Банкоматы").click();
    cy.hash().should("eq", banks);
    cy.contains("Счета").click();
    cy.hash().should("eq", accounts);
    cy.contains("Валюты").click();
    cy.hash().should("eq", currency);
    cy.contains("Выйти").click();
    cy.reload();
    cy.hash().should("eq", autorization);
    cy.get(".login__form").should("be.visible");
  });
});
