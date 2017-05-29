export class MoneyFlow {
    private spent: number = 0;
    private gained: number = 0;

    addAmount(amount: number) {
        if (amount < 0)
            this.spent += (-1) * amount;
        else
            this.gained += amount;
    }
    getSpent() {
        return this.spent;
    }
    getGained() {
        return this.gained;
    }
}