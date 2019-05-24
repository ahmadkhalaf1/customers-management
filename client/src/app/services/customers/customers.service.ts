import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import Customer from "../../model/customer";
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: "root"
})
export class CustomerService {
  apiURL: string = environment.apiURL;

  constructor(private httpClient: HttpClient) {}

  public createCustomer(customer: Customer) {
    return this.httpClient.post(`${this.apiURL}/customers`, customer);
  }

  public updateCustomer(customer: Customer) {
    return this.httpClient.put(`${this.apiURL}/customers`, customer);
  }

  public deleteCustomer(id: number) {
    return this.httpClient.delete(`${this.apiURL}/customers/${id}`);
  }

  public checkCustomerIdNotTaken(id: number) {  
    return this.httpClient.get(`${environment.apiURL}/customers/${id}`);
  }

  public getCustomers() {
    return this.httpClient.get<Customer[]>(`${this.apiURL}/customers`);
  }
}
