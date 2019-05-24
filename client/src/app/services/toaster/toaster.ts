import { ToastrService } from "ngx-toastr";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ToasterService {
  constructor(private toastr: ToastrService) {}
  showSuccess(message) {
    this.toastr.success(message, "Success!");
  }
  showError(message) {
    this.toastr.error(message, "Error!");
  }
}
