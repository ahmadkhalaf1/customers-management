import { Injectable } from "@angular/core";
import Customer from "../../model/customer";

@Injectable({
  providedIn: "root"
})
export class ShareDataService {
  customer: Customer;

  constructor() {}
}

