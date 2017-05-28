import { Component } from '@angular/core';
import { TransactionService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private transactionsGainedByDate: Map<string, number>;
  private sumGained: number;

  private transactionsSpentByDate: Map<string, number>;
  private sumSpent: number;

  private transactionDates: Map<string, string>;

  constructor(private transactionService: TransactionService) {
    transactionService.search().subscribe(
      transactions => {

        //reset variables
        this.transactionsGainedByDate = new Map();
        this.sumGained = 0;
        this.transactionsSpentByDate = new Map();
        this.sumSpent = 0;
        this.transactionDates = new Map();

        transactions.forEach((transaction: JSON) => {

          //format date
          let transactionYear: string = new Date(transaction['transaction-time']).getFullYear().toString();
          let transactionMonth: string = this.formatMonth(new Date(transaction['transaction-time']).getMonth() + 1);
          let transactionDate: string = transactionYear + '-' + transactionMonth;

          //add date to map to later relate
          this.transactionDates.set(transactionDate, transactionDate);

          if (transaction['amount'] < 0) {
            if (this.transactionsSpentByDate.has(transactionDate)) {
              this.transactionsSpentByDate.set(transactionDate,
                this.transactionsSpentByDate.get(transactionDate) + (-1)*transaction['amount']);
            } // check if this date is already in map 
            else {
              this.transactionsSpentByDate.set(transactionDate, (-1)*transaction['amount']);
            }// else just add the current value

            this.sumSpent += (-1)*transaction['amount'];
          }//check if money was spent
          else {
            if (this.transactionsGainedByDate.has(transactionDate)) {
              this.transactionsGainedByDate.set(transactionDate,
                this.transactionsGainedByDate.get(transactionDate) + transaction['amount']);
            } // check if this date is already in map 
            else {
              this.transactionsGainedByDate.set(transactionDate, transaction['amount']);
            }// else just add the current value
            this.sumGained += transaction['amount'];
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
    })//for each date, add it to the object

    balancesObject['average'] = { 'spent': '$' + this.formatAmount(this.sumSpent/this.transactionsSpentByDate.size), 'income': '$' + this.formatAmount(this.sumGained/this.transactionsGainedByDate.size) };
    console.log(JSON.stringify(balancesObject));
  } //Format desired output

  private formatAmount(amount: number): string {
    return (amount / 100).toFixed(2);
  } //Format transaction amounts to show decimals

  private formatMonth(month: number): string {
    return month < 10 ? '0' + month : month.toString();
  } //Format month to have leading 0

  title = 'app works!';
}
