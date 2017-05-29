import { Component } from '@angular/core';
import { TransactionService } from './app.service';
import { Transaction } from './transaction';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private transactionsByDate: Map<string, Transaction>;

  constructor(private transactionService: TransactionService) {
    transactionService.search().subscribe(
      transactions => {

        //reset variables
        this.transactionsByDate = new Map();

        transactions.forEach((transaction: JSON) => {

          //format date
          let transactionYear: string = new Date(transaction['transaction-time']).getFullYear().toString();
          let transactionMonth: string = this.formatMonth(new Date(transaction['transaction-time']).getMonth() + 1);
          let transactionDate: string = transactionYear + '-' + transactionMonth;

          let amount: number = transaction['amount'];

          //add date to map to later relate
          //this.transactionDates.set(transactionDate, transactionDate);
          if (this.transactionsByDate.has(transactionDate)) {
            var curTransaction: Transaction = this.transactionsByDate.get(transactionDate);

              curTransaction.addAmount(amount);
              this.transactionsByDate.set(transactionDate, curTransaction);
            //check if money was gained
          }//check if date is in map
          else {
            var curTransaction: Transaction = new Transaction();
            curTransaction.addAmount(amount);
            this.transactionsByDate.set(transactionDate, curTransaction);
          }//money was gained
        })
      }, // While receiving transactions
      error => {
        console.log('woa! ' + error)
      }, // On subscriber error 
      () => {
        this.getMonthlyBalances();
      }//On subscriber succesful completion
    );
  }//Get transactions from service

  private getMonthlyBalances() {
    var balancesObject = {};
    var spentAmount: number = 0;
    var gainedAmount: number = 0;
    
    this.transactionsByDate.forEach((trans: Transaction, date: string) => {
      let monthSpentAmount = trans.getSpent();
      spentAmount += monthSpentAmount;

      let monthGainedAmount = trans.getGained();
      gainedAmount += monthGainedAmount;
      balancesObject[date] = { 'spent': '$' + this.formatAmount(monthSpentAmount), 'income': '$' + this.formatAmount(monthGainedAmount) };
    })//for each date, add it to the object

    balancesObject['average'] = { 'spent': '$' + this.formatAmount(spentAmount / this.transactionsByDate.size), 'income': '$' + this.formatAmount(gainedAmount / this.transactionsByDate.size) };

    console.log(balancesObject)
  }

  private formatAmount(amount: number): string {
    return (amount / 100).toFixed(2);
  } //Format transaction amounts to show decimals

  private formatMonth(month: number): string {
    return month < 10 ? '0' + month : month.toString();
  } //Format month to have leading 0

  title = 'app works!';
}