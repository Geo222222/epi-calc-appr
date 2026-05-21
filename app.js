const inputs = {
  symbol: document.getElementById("symbol"),
  balance: document.getElementById("balance"),
  leverage: document.getElementById("leverage"),
  creditUtil: document.getElementById("creditUtil"),
  profitPct: document.getElementById("profitPct"),
  feePct: document.getElementById("feePct"),
  price: document.getElementById("price"),
  steps: document.getElementById("steps"),
};

const leverageHeader = document.getElementById("leverageHeader");
const resultsBody = document.getElementById("resultsBody");
const footerParams = document.getElementById("footerParams");
const footerTotals = document.getElementById("footerTotals");

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
  const initialBalance = parseNumber(inputs.balance.value);
  const leverage = parseNumber(inputs.leverage.value);
  const creditUtilPct = parseNumber(inputs.creditUtil.value);
  const profitPct = parseNumber(inputs.profitPct.value);
  const feePct = parseNumber(inputs.feePct.value);
  const price = parseNumber(inputs.price.value);
  let steps = Math.max(1, Math.floor(parseNumber(inputs.steps.value) || 1));

  leverageHeader.textContent = Number.isFinite(leverage) ? `${leverage}X` : "—X";

  footerParams.textContent = `Util ${formatPercent(creditUtilPct || 0)} • Profit ${formatPercent(profitPct || 0)} • Fee ${formatPercent(feePct || 0)}`;

  const invalid =
    !Number.isFinite(initialBalance) ||
    !Number.isFinite(leverage) ||
    !Number.isFinite(creditUtilPct) ||
    !Number.isFinite(profitPct) ||
    !Number.isFinite(feePct) ||
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
  const netRate = (profitPct - feePct) / 100;

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

Object.values(inputs).forEach((input) => {
  input.addEventListener("input", calculate);
});

calculate();
