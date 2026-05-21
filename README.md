# Margin Calculator

A simple web-based margin calculator for projecting leveraged trading outcomes across multiple compounding steps.

## How to Run

No install or build step required.

1. Clone the repo:
   ```bash
   git clone https://github.com/Geo222222/epi-calc-appr.git
   cd epi-calc-appr
   ```
2. Open `index.html` in your browser (double-click the file or drag it into a browser window).

Alternatively, serve the folder locally:

```bash
npx serve .
```

Then open the URL shown in your terminal (usually `http://localhost:3000`).

## How to Use

1. Enter your trading pair in **Symbol** (display only).
2. Set **Account Balance**, **Leverage**, **Credit Utilization %**, and **Price Per Asset**.
3. Set **Steps** to simulate one or more compounding trades.
4. The table updates automatically with balance, buying power, credit used, and asset amount per step.
5. The footer shows total **Final** balance and **Profit** after all steps.

Profit and fee rates are fixed at **0.75%** and **0.10%**. Calculations assume each step reinvests net profit (profit minus fees) into the next step's balance.
