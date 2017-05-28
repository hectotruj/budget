import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class TransactionService {
    private headers = new Headers({ 'Content-Type': 'application/json' });
    constructor(private http: Http) { }
    search(): Observable<JSON[]> {
        let args = {
            "args":
            {
                "uid": 1110590645,
                "token": "FB092CEB29078E54B4CFC046A0C36B47",
                "api-token": "AppTokenForInterview",
                "json-strict-mode": false,
                "json-verbose-response": false
            }
        };
        return this.http
            .post(`https://2016.api.levelmoney.com/api/v2/core/get-all-transactions`, JSON.stringify(args), { headers: this.headers })
            .map(response => response.json() as JSON[]);
    } // get transactions
}

