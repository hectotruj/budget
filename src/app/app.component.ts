import { Component } from '@angular/core';
import { TransactionService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private transactionsGainedByDate: Map<string, number>;
  private transactionsSpentByDate: Map<string, number>;
  private transactionDates: Map<string, string>;

  constructor(private transactionService: TransactionService) {
    transactionService.search().subscribe(
      transactions => {

        //reset maps
        this.transactionsGainedByDate = new Map();
        this.transactionsSpentByDate = new Map();
        this.transactionDates = new Map();

        transactions.forEach((transaction: JSON) => {

          //format date
          let transactionYear: number = new Date(transaction['transaction-time']).getFullYear();
          let transactionMonth: number = new Date(transaction['transaction-time']).getMonth() + 1;
          let transactionDate: string = transactionYear + '-' + transactionMonth;

          //add date to map to later relate
          this.transactionDates.set(transactionDate, transactionDate);

          if (transaction['amount'] < 0) {
            if (this.transactionsSpentByDate.has(transactionDate)) {
              this.transactionsSpentByDate.set(transactionDate,
                this.transactionsSpentByDate.get(transactionDate) + transaction['amount']);
            } // check if this date is already in map 
            else {
              this.transactionsSpentByDate.set(transactionDate, transaction['amount']);
            }// else just add the current value
          }//check if money was spent
          else {
            if (this.transactionsGainedByDate.has(transactionDate)) {
              this.transactionsGainedByDate.set(transactionDate,
                this.transactionsGainedByDate.get(transactionDate) + transaction['amount']);
            } // check if this date is already in map 
            else {
              this.transactionsGainedByDate.set(transactionDate, transaction['amount']);
            }// else just add the current value
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
    this.transactionDates.forEach((date: string) => {
      let monthSpentAmount = this.transactionsSpentByDate.has(date) ? this.formatAmount(this.transactionsSpentByDate.get(date)) : '0.00';
      let monthGainedAmount = this.transactionsGainedByDate.has(date) ? this.formatAmount(this.transactionsGainedByDate.get(date)) : '0.00';
      balancesObject[date] = { 'spent': '$' + monthSpentAmount, 'income': '$' + monthGainedAmount };
    })
    console.log(JSON.stringify(balancesObject));
  }

  private formatAmount(amount: number): string {
    return (amount / 100).toFixed(2);
  }

  title = 'app works!';
}
