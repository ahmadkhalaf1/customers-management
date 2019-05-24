import "hammerjs";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FlexLayoutModule } from "@angular/flex-layout";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { BroadcasterService } from "./services/broadcaster/broadcaster.service";
import { ShareDataService } from "./services/customers/share-data.service";

import { AppComponent } from "./app.component";
import { RoutingModule } from "./routing/routing.module";
import { HomeComponent } from "./components/home/home.component";
import { HeaderComponent } from "./components/navigation/header/header.component";
import { SidenavListComponent } from "./components/navigation/sidenav-list/sidenav-list.component";
import { NgxSpinnerModule } from "ngx-spinner";

import { MaterialModule } from "./material/material.module";
import { LayoutComponent } from "./components/layout/layout.component";
import { AddCustomerComponent } from "./components/add-customer/add-customer.component";

import { ToastrModule } from "ngx-toastr";
import { PopupComponent } from "./components/popup/popup.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    SidenavListComponent,
    LayoutComponent,
    AddCustomerComponent,
    PopupComponent
  ],
  entryComponents: [PopupComponent],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 8000,
      positionClass: "toast-bottom-right",
      preventDuplicates: true
    }),
    ReactiveFormsModule,
    HttpClientModule,
    RoutingModule,
    MaterialModule,
    FlexLayoutModule,
    NgxSpinnerModule
  ],
  exports: [],
  providers: [BroadcasterService, ShareDataService],
  bootstrap: [AppComponent]
})
export class AppModule {}
