import { el } from "redom";

export function createBanksPage() {
  const banksMap = el("div", { class: "banks__map" });
  const banks = el("div", { class: "banks" }, [
    el("h2", { class: "banks__title title" }, "Карта банкоматов"),
    banksMap,
  ]);
  return { banks, banksMap };
}
