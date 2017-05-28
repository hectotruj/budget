import { Component } from '@angular/core';
import { TransactionService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private transactions: JSON[];
  constructor(private transactionService: TransactionService){
    transactionService.search().subscribe(
      transactions => {
        console.log(transactions);
      }, // While receiving transactions
      error => {
        console.log('woa! ' + error)
      }, // On subscriber error 
      () => {
        console.log('you\'re done');
      }//On subscriber succesful completion
    );
  }//Get transactions from service

  
  title = 'app works!';
}
