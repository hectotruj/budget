import { Component } from '@angular/core';
import { TransactionService, PredictiveService } from './app.service';
import { MoneyFlow } from './money-flow';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private moneyFlowByDate: Map<string, MoneyFlow>;
  private predictedMoneyFlowByDate: Map<string, MoneyFlow>;

  moneyFlowByDateObject;
  predictedMoneyFlowByDateObject;

  constructor(private transactionService: TransactionService, private predictiveService: PredictiveService) {
    transactionService.search().subscribe(
      transactions => {

        //reset variables
        this.moneyFlowByDate = new Map();
        if (typeof transactions != 'undefined') {
          transactions.forEach((transaction: JSON) => {

            //format date
            let transactionYear: string = new Date(transaction['transaction-time']).getFullYear().toString();
            let transactionMonth: number = new Date(transaction['transaction-time']).getMonth() + 1;
            let transactionDate: string = transactionYear + '-' + this.formatMonth(transactionMonth);

            let amount: number = transaction['amount'];

            if (this.moneyFlowByDate.has(transactionDate)) {
              var moneyFlow: MoneyFlow = this.moneyFlowByDate.get(transactionDate);

              moneyFlow.addAmount(amount);
              this.moneyFlowByDate.set(transactionDate, moneyFlow);
            }//check if date is in map
            else {
              var moneyFlow: MoneyFlow = new MoneyFlow();
              moneyFlow.addAmount(amount);
              this.moneyFlowByDate.set(transactionDate, moneyFlow);
            }//if not in map, add it
          })
        }
      }, // While receiving transactions
      error => {
        console.log('woa! ' + error)
      }, // On subscriber error 
      () => {
        this.predictedMoneyFlowByDate = this.moneyFlowByDate;
        predictiveService.search().subscribe(
          predictedTransactions => {
            if (typeof predictedTransactions != 'undefined') {
              predictedTransactions.forEach((predictedTransaction: JSON) => {
                let predictedTransactionYear: string = new Date(predictedTransaction['transaction-time']).getFullYear().toString();
                let predictedTransactionMonth: number = new Date(predictedTransaction['transaction-time']).getMonth() + 1;
                let predictedTransactionDate: string = predictedTransactionYear + '-' + this.formatMonth(predictedTransactionMonth);

                let predictedAmount: number = predictedTransaction['amount'];

                var predictedMoneyFlow: MoneyFlow = this.predictedMoneyFlowByDate.get(predictedTransactionDate);
                predictedMoneyFlow.addAmount(predictedAmount);

                this.predictedMoneyFlowByDate.set(predictedTransactionDate, predictedMoneyFlow);
              })
            }
          }, // While receiving transactions
          error => {
            console.log('woa! ' + error)
          }, // On subscriber error 
          () => {
            this.predictedMoneyFlowByDateObject = this.getMonthlyBalances(this.predictedMoneyFlowByDate);
            console.log(this.predictedMoneyFlowByDateObject)
          }
        )

        this.moneyFlowByDateObject = this.getMonthlyBalances(this.moneyFlowByDate);
        console.log(this.moneyFlowByDateObject)

      }//On subscriber succesful completion
    );
  }//Get transactions from service

  private getMonthlyBalances(moneyFlowByDate: Map<string, MoneyFlow>) {
    var balancesObject = {};
    var spentAmount: number = 0;
    var gainedAmount: number = 0;

    moneyFlowByDate.forEach((trans: MoneyFlow, date: string) => {
      let monthSpentAmount = trans.getSpent();
      spentAmount += monthSpentAmount;

      let monthGainedAmount = trans.getGained();
      gainedAmount += monthGainedAmount;
      balancesObject[date] = { 'spent': '$' + this.formatAmount(monthSpentAmount), 'income': '$' + this.formatAmount(monthGainedAmount) };
    })//for each date, add it to the object

    balancesObject['average'] = { 'spent': '$' + this.formatAmount(spentAmount / moneyFlowByDate.size), 'income': '$' + this.formatAmount(gainedAmount / moneyFlowByDate.size) };

    return JSON.stringify(balancesObject);
  }

  private formatAmount(amount: number): string {
    return (amount / 100).toFixed(2);
  } //Format transaction amounts to show decimals

  private formatMonth(month: number): string {
    return month < 10 ? '0' + month : month.toString();
  } //Format month to have leading 0

  title = 'app works!';
}