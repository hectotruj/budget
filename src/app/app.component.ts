import { Component } from '@angular/core';
import { TransactionService, PredictiveService } from './app.service';
import { MoneyFlow } from './money-flow';
import { Transaction } from './transaction';

const merchantFilter: string[] = ['Krispy Kreme Donuts', 'Dunkin #336784']

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private transactionByDate: Map<string, Transaction>;
  private predictedTransactionByDate: Map<string, Transaction>;
  private filteredTransactionByDate: Map<string, Transaction>;

  transactionByDateObject: JSON[];
  predictedTransactionByDateObject: JSON[];
  filteredTransactionByDateObject: JSON[];

  constructor(private transactionService: TransactionService, private predictiveService: PredictiveService) {
    transactionService.search().subscribe(
      transactions => {

        //reset variables
        this.transactionByDate = new Map();
        this.filteredTransactionByDate = new Map();

        if (typeof transactions != 'undefined') {
          transactions.forEach((transaction: JSON) => {

            //format date
            let transactionYear: string = new Date(transaction['transaction-time']).getFullYear().toString();
            let transactionMonth: number = new Date(transaction['transaction-time']).getMonth() + 1;
            let transactionDate: string = transactionYear + '-' + this.formatMonth(transactionMonth);

            let amount: number = transaction['amount'];

            if (this.transactionByDate.has(transactionDate)) {
              var curTransaction: Transaction = this.transactionByDate.get(transactionDate);

              curTransaction.addAmount(amount);
              this.transactionByDate.set(transactionDate, curTransaction);
            }//check if date is in main map
            else {
              var curTransaction: Transaction = new Transaction(transactionDate);
              curTransaction.addAmount(amount);
              this.transactionByDate.set(transactionDate, curTransaction);
            }//if not in map, add it to main map

            if (!merchantFilter.includes(transaction['merchant'])) {
              if (this.filteredTransactionByDate.has(transactionDate)) {
                var curTransaction: Transaction = this.filteredTransactionByDate.get(transactionDate);

                curTransaction.addAmount(amount);
                this.filteredTransactionByDate.set(transactionDate, curTransaction);
              }//check if date is in filtered map
              else {
                var curTransaction: Transaction = new Transaction(transactionDate);
                curTransaction.addAmount(amount);
                this.filteredTransactionByDate.set(transactionDate, curTransaction);
              }//if not in map, add it to filtered map
            }// add filters
          })
        }
      }, // While receiving transactions
      error => {
        console.log('woa! ' + error)
      }, // On subscriber error 
      () => {
        this.predictedTransactionByDate = this.transactionByDate;
        predictiveService.search().subscribe(
          predictedTransactions => {
            if (typeof predictedTransactions != 'undefined') {
              predictedTransactions.forEach((predictedTransaction: JSON) => {
                let predictedTransactionYear: string = new Date(predictedTransaction['transaction-time']).getFullYear().toString();
                let predictedTransactionMonth: number = new Date(predictedTransaction['transaction-time']).getMonth() + 1;
                let predictedTransactionDate: string = predictedTransactionYear + '-' + this.formatMonth(predictedTransactionMonth);

                let predictedAmount: number = predictedTransaction['amount'];

                var curPredictedTransaction: Transaction = this.predictedTransactionByDate.get(predictedTransactionDate);
                curPredictedTransaction.addAmount(predictedAmount);

                this.predictedTransactionByDate.set(predictedTransactionDate, curPredictedTransaction);
              })
            }
          }, // While receiving transactions
          error => {
            console.log('woa! ' + error)
          }, // On subscriber error 
          () => {
            this.predictedTransactionByDateObject = this.getMonthlyBalances(this.predictedTransactionByDate);
            console.log(this.predictedTransactionByDateObject)
          }
        )

        this.transactionByDateObject = this.getMonthlyBalances(this.transactionByDate);
        console.log(this.transactionByDateObject)

        this.filteredTransactionByDateObject = this.getMonthlyBalances(this.filteredTransactionByDate);
        console.log(this.filteredTransactionByDateObject)

      }//On subscriber succesful completion
    );
  }//Get transactions from service

  private getMonthlyBalances(transactionByDate: Map<string, Transaction>) {
    var balancesObject = [];
    var spentAmount: number = 0;
    var gainedAmount: number = 0;

    transactionByDate.forEach((trans: Transaction, date: string) => {
      let monthSpentAmount = trans.getSpent();
      spentAmount += monthSpentAmount;

      let monthGainedAmount = trans.getIncome();
      gainedAmount += monthGainedAmount;
      balancesObject.push(trans);
    })//for each date, add it to the object

    var tempTransaction = new Transaction('Average');
    tempTransaction.addAmount((-1) * spentAmount / transactionByDate.size);
    tempTransaction.addAmount(gainedAmount / transactionByDate.size);

    balancesObject.push(tempTransaction);

    return balancesObject;
  }

  formatAmount(amount: number): string {
    return '$' + (amount / 100).toFixed(2);
  } //Format transaction amounts to show decimals

  private formatMonth(month: number): string {
    return month < 10 ? '0' + month : month.toString();
  } //Format month to have leading 0

  title = 'app works!';
}