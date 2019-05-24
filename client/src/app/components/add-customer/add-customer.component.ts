import { Component, OnInit, AfterContentInit, OnDestroy } from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
  FormGroupDirective
} from "@angular/forms";
import { CustomerService } from "../../services/customers/customers.service";
import { ToasterService } from "../../services/toaster/toaster";
import { ShareDataService } from "../../services/customers/share-data.service";
import Customer from "../../model/customer";

@Component({
  selector: "app-add-customer",
  templateUrl: "./add-customer.component.html",
  styleUrls: ["./add-customer.component.scss"]
})
export class AddCustomerComponent
  implements OnInit, OnDestroy, AfterContentInit {
  public customerForm: FormGroup;
  options: FormGroup;
  emptyCustomer: Customer;
  editMode = false;
  customerIdTaken = false;
  constructor(
    private customerService: CustomerService,
    private toaster: ToasterService,
    private shareData: ShareDataService
  ) {}

  /**
   * after content is ready fetch customer data from service and fill the form
   */
  ngAfterContentInit() {
    let customerObject = this.shareData.customer;
    if (customerObject && !this.isEmpty(customerObject)) {
      this.editMode = true;
      this.customerForm.controls["customerID"].disable();
      for (const [key, value] of Object.entries(customerObject)) {
        if (key === "name") {
          this.customerForm.get("firstName").setValue(value.first);
          this.customerForm.get("lastName").setValue(value.last);
          continue;
        }
        this.customerForm.get(key).setValue(value);
      }
    }
  }

  ngOnInit() {
    //Create a form
    this.initForm();
  }

  /**
   * checkCustomerIdTaken
   * Check if customer id is taken and trigger a form error ,
   * could make a separated validator file and import it to form control errors field as
   * a custom validator
   */
  checkCustomerIdTaken = e => {
    let customerId = e.target.value;
    if (customerId !== "") {
      this.customerService.checkCustomerIdNotTaken(customerId).subscribe(
        (res: any) => {
          if (!res.available) {
            this.customerForm.controls["customerID"].setErrors({
              customerIdTaken: true
            });
          }
        },
        error => {
          return null;
        }
      );
    }
  };

  /**
   * check if object is empty
   */
  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  ngOnDestroy() {
    this.shareData.customer = this.emptyCustomer;
  }

  initForm() {
    this.customerForm = new FormGroup({
      customerID: new FormControl("", [Validators.required]),
      firstName: new FormControl("", [Validators.required]),
      lastName: new FormControl("", [Validators.required]),
      gender: new FormControl("", [Validators.required]),
      birthday: new FormControl("", [Validators.required]),
      lastContact: new FormControl("", [Validators.required]),
      customerLifetimeValue: new FormControl("", [Validators.required])
    });
  }

  /**
   * check if input has error
   */
  public hasError = (controlName: string, errorName: string) => {
    return this.customerForm.controls[controlName].hasError(errorName);
  };

  onFormSubmit(formDirective: FormGroupDirective) {
    let values = this.customerForm.getRawValue();

    if (this.customerForm.valid) {
      const type = this.editMode ? "updateCustomer" : "createCustomer";
      this.customerService[type](values).subscribe(
        (res: any) => {
          this.toaster.showSuccess(res.message);
          this.resetForm(formDirective);
        },
        error => {
          this.toaster.showError(error.error.message);
        }
      );
    }
  }
  /**
   * reset form after submission 
   */
  resetForm(formDirective) {
    formDirective.resetForm();
    this.customerForm.reset();
  }
}
