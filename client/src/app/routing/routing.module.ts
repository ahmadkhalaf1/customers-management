import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

// components
import { HomeComponent } from "../components/home/home.component";
import { AddCustomerComponent } from "../components/add-customer/add-customer.component";
const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "add-customer", component: AddCustomerComponent },
  { path: "", redirectTo: "/home", pathMatch: "full" }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule {}
