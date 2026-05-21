const DEFAULTS = {
  balance: 4600,
  leverage: 400,
  creditUtil: 50,
  price: 2131.25,
  steps: 1,
  profitPct: 0.75,
  feePct: 0.1,
};

function getInputNumber(id, fallback) {
  const el = document.getElementById(id);
  if (!el) return fallback;
  const value = parseNumber(el.value);
  return Number.isFinite(value) ? value : fallback;
}

function parseNumber(value) {
  if (typeof value !== "string") return NaN;
  const cleaned = value.replace(/,/g, "").trim();
  if (cleaned === "") return NaN;
  return Number(cleaned);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatAmount(value) {
  return value.toFixed(6);
}

function formatPercent(value) {
  return `${value.toFixed(2)}%`;
}

function calculate() {
  const leverageHeader = document.getElementById("leverageHeader");
  const resultsBody = document.getElementById("resultsBody");
  const footerParams = document.getElementById("footerParams");
  const footerTotals = document.getElementById("footerTotals");

  if (!resultsBody || !footerTotals) return;

  const initialBalance = getInputNumber("balance", DEFAULTS.balance);
  const leverage = getInputNumber("leverage", DEFAULTS.leverage);
  const creditUtilPct = getInputNumber("creditUtil", DEFAULTS.creditUtil);
  const price = getInputNumber("price", DEFAULTS.price);
  const steps = Math.max(1, Math.floor(getInputNumber("steps", DEFAULTS.steps)));

  if (leverageHeader) {
    leverageHeader.textContent = Number.isFinite(leverage) ? `${leverage}X` : "—X";
  }

  if (footerParams) {
    footerParams.textContent = `Util ${formatPercent(creditUtilPct)} • Profit ${formatPercent(DEFAULTS.profitPct)} • Fee ${formatPercent(DEFAULTS.feePct)}`;
  }

  const invalid =
    !Number.isFinite(initialBalance) ||
    !Number.isFinite(leverage) ||
    !Number.isFinite(creditUtilPct) ||
    !Number.isFinite(price) ||
    initialBalance <= 0 ||
    leverage <= 0 ||
    price <= 0 ||
    steps < 1;

  if (invalid) {
    resultsBody.innerHTML = "";
    footerTotals.textContent = "Final $0.00 • Profit $0.00";
    return;
  }

  const utilRate = creditUtilPct / 100;
  const netRate = (DEFAULTS.profitPct - DEFAULTS.feePct) / 100;

  let balance = initialBalance;
  const rows = [];

  for (let step = 1; step <= steps; step += 1) {
    const buyingPower = balance * leverage;
    const creditUtil = buyingPower * utilRate;
    const amount = creditUtil / price;

    rows.push({
      step,
      balance,
      buyingPower,
      creditUtil,
      amount,
    });

    balance += creditUtil * netRate;
  }

  resultsBody.innerHTML = rows
    .map(
      (row) => `
      <tr>
        <td>${row.step}</td>
        <td>${formatCurrency(row.balance)}</td>
        <td>${formatCurrency(row.buyingPower)}</td>
        <td>${formatCurrency(row.creditUtil)}</td>
        <td>${formatAmount(row.amount)}</td>
      </tr>
    `
    )
    .join("");

  const totalProfit = balance - initialBalance;
  footerTotals.textContent = `Final ${formatCurrency(balance)} • Profit ${formatCurrency(totalProfit)}`;
}

function init() {
  const app = document.querySelector(".app");
  if (app) {
    app.addEventListener("input", (event) => {
      if (event.target instanceof HTMLInputElement) {
        calculate();
      }
    });
  }

  calculate();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
