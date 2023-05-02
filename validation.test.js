import {
  validateLogin,
  validatePassword,
  validateInputTo,
  validateInputAmount,
} from "./client/src/validate";

describe("Авторизация", () => {
  test("Валидация логина (не менее 6, не более 16 значений, включая _ -)", () => {
    expect(validateLogin("developer")).toBe("developer");
    expect(validateLogin("developer_123")).toBe("developer_123");
    expect(validateLogin("developer-123")).toBe("developer-123");
    expect(validateLogin("developer-123_12")).toBe("developer-123_12");
    expect(() => {
      validateLogin("devel oper-123_123");
    }).toThrow(new Error("Некорректное значение логина"));
  });
  //   test("Test description", () => {
  //     const t = () => {
  //       throw new TypeError("UNKNOWN ERROR");
  //     };
  //     expect(t).toThrow(TypeError);
  //     expect(t).toThrow("UNKNOWN ERROR");
  //   });
  test("Валидация логина (не содержит пробелов и других символов)", () => {
    expect(() => {
      validateLogin("dev");
    }).toThrow(new Error("Некорректное значение логина"));
    expect(() => {
      validateLogin("dev loper");
    }).toThrow(new Error("Некорректное значение логина"));
    expect(() => {
      validateLogin("123$%&***()&^");
    }).toThrow(new Error("Некорректное значение логина"));
  });
  test("Валидация пароля (содержит не менее 6, не более 16 значений, включая _ -", () => {
    expect(validatePassword("skillbox")).toBe("skillbox");
    expect(validatePassword("skillbox12345678")).toBe("skillbox12345678");
    expect(() => {
      validatePassword("skillbox1234567800");
    }).toThrow(new Error("Некорректное значение пароля"));
  });
  test("Валидация пароля (не содержит некорректных символов и пробелов", () => {
    expect(() => {
      validatePassword("2 522 068/1hjhd");
    }).toThrow(new Error("Некорректное значение пароля"));
    expect(() => {
      validatePassword("skil lbox");
    }).toThrow(new Error("Некорректное значение пароля"));
    expect(() => {
      validatePassword("влр@аоврh,jhd");
    }).toThrow(new Error("Некорректное значение пароля"));
  });
});
describe("Перевод средств", () => {
  test("Валидация инпута номера счета (содержит только цифры длинной от 14 до 26)", () => {
    expect(validateInputTo("17401801878567355354257374")).toBe(
      "17401801878567355354257374"
    );
    expect(validateInputTo("17401801878567")).toBe("17401801878567");
    expect(() => {
      validateInputTo("1000 0000 0000 0000");
    }).toThrow(new Error("Некорректный счет"));
  });
  test("Валидация инпута номера счета (не содержит букв, пробелов и пустых значений)", () => {
    expect(() => {
      validateInputTo("27 42254/54&53860");
    }).toThrow(new Error("Некорректный счет"));
    expect(() => {
      validateInputTo("abc");
    }).toThrow(new Error("Некорректный счет"));
    expect(() => {
      validateInputTo("абвгд");
    }).toThrow(new Error("Некорректный счет"));
    expect(() => {
      validateInputTo(null);
    }).toThrow(new Error("Некорректный счет"));
    expect(() => {
      validateInputTo(undefined);
    }).toThrow(new Error("Некорректный счет"));
    expect(() => {
      validateInputTo();
    }).toThrow(new Error("Некорректный счет"));
  });
  test("Валидация суммы перевода (содержит положительное значение)", () => {
    expect(validateInputAmount("200")).toBe("200");
    expect(validateInputAmount("12300000")).toBe("12300000");
  });
  test("Валидация суммы перевода (не содержит букв и пустых значений)", () => {
    expect(() => {
      validateInputAmount("абв");
    }).toThrow(new Error("Сумма не корректна"));
    expect(() => {
      validateInputAmount(null);
    }).toThrow(new Error("Сумма не корректна"));
    expect(() => {
      validateInputAmount(undefined);
    }).toThrow(new Error("Сумма не корректна"));
  });
  test("Валидация суммы перевода (не содержит отрицательных значений)", () => {
    expect(() => {
      validateInputAmount("-1000");
    }).toThrow(new Error("Отрицательная сумма"));
  });
});
