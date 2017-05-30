export class MoneyFlow {
    private spent: number = 0;
    private income: number = 0;

    addAmount(amount: number) {
        if (amount < 0)
            this.spent += (-1) * amount;
        else
            this.income += amount;
    }
    getSpent() {
        return this.spent;
    }
    getIncome() {
        return this.income;
    }
}