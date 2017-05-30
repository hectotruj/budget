import { MoneyFlow } from './money-flow';

export class Transaction {
    private name: string;
    private moneyFlow: MoneyFlow;

    constructor(name: string) {
        this.name = name;
        this.moneyFlow = new MoneyFlow();
    }
    addAmount(amount: number) {
        this.moneyFlow.addAmount(amount);
    }
    setName(name: string) {
        this.name = name;
    }
    getSpent() {
        return this.moneyFlow.getSpent();
    }
    getIncome() {
        return this.moneyFlow.getIncome();
    }
    getMoneyFlow() {
        return this.moneyFlow;
    }
}