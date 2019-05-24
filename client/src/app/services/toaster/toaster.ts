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
    let messageText =
      typeof message === "string" && message
        ? message
        : "System Error please contact support";
    this.toastr.error(messageText, "Error!");
  }
}
