import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatTableDataSource, MatSort } from "@angular/material";
import Customer from "../../model/customer";
import { CustomerService } from "../../services/customers/customers.service";
import { ToasterService } from "../../services/toaster/toaster";
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { PopupComponent } from "../popup/popup.component";
import { ShareDataService } from "../../services/customers/share-data.service";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = [
    "customerID",
    "name.first",
    "name.last",
    "birthday",
    "gender",
    "lastContact",
    "customerLifetimeValue",
    "edit",
    "delete"
  ];
  dataSource = new MatTableDataSource<Customer>();
  noDataFlag = false;
  private paginator: MatPaginator;
  private sort: MatSort;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setPaginationDataSourceAttributes();
  }
  @ViewChild(MatSort) set maSort(sort: MatSort) {
    this.sort = sort;
    this.setSortDataSourceAttributes();
  }

  constructor(
    private customerService: CustomerService,
    private toaster: ToasterService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private shareData: ShareDataService,
    private router: Router
  ) {}

  /**
   * open delete confirmation modal
   */
  openDialog(e, element): void {
    e.stopPropagation();

    const dialogRef = this.dialog.open(PopupComponent, {
      width: "400px",
      data: { name: element.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteCustomer(element);
      }
    });
  }

  setPaginationDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
  }

  setSortDataSourceAttributes() {
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.spinner.show();
    this.customerService.getCustomers().subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.customerList.length <= 0) {
          res.customerList.length <= 0
            ? (this.noDataFlag = true)
            : (this.noDataFlag = false);
        } else {
          this.dataSource = new MatTableDataSource<Customer>(res.customerList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
          this.dataSource.sort = this.sort;
          this.searchFilterInit();
        }
      },
      error => {
        this.noDataFlag = true;
        this.spinner.hide();
      }
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  searchFilterInit() {
    // customize search filter to work with nested object like name{first:'',last:''}
    this.dataSource.filterPredicate = (data, filter: string) => {
      const accumulator = (currentTerm, key) => {
        return this.nestedFilterCheck(currentTerm, data, key);
      };
      const dataStr = Object.keys(data)
        .reduce(accumulator, "")
        .toLowerCase();

      // Transform the filter by converting it to lowercase and removing whitespace.
      const transformedFilter = filter.trim().toLowerCase();

      return dataStr.indexOf(transformedFilter) !== -1;
    };
  }

  // customize search filter to work with nested object like name{first:'',last:''}
  nestedFilterCheck(search, data, key) {
    if (typeof data[key] === "object") {
      for (const k in data[key]) {
        if (data[key][k] !== null) {
          search = this.nestedFilterCheck(search, data[key], k);
        }
      }
    } else {
      search += data[key];
    }
    return search;
  }

  // customize sort to work with nested object like name{first:'',last:''}
  sortingDataAccessor(item, property) {
    if (property.includes(".")) {
      return property.split(".").reduce((object, key) => object[key], item);
    }
    return item[property];
  }

  deleteCustomer(row) {
    this.spinner.show();
    this.customerService.deleteCustomer(row.customerID).subscribe(
      (res: any) => {
        this.spinner.hide();
        const dsData = this.dataSource.data;
        const itemIndex = dsData.findIndex(
          obj => obj.customerID === row.customerID
        );

        this.dataSource.data.splice(itemIndex, 1);

        this.dataSource.paginator = this.paginator;

        this.toaster.showSuccess(res.message);
      },
      error => {
        this.spinner.hide();
        this.toaster.showError(error.error.message);
      }
    );
  }

  editCustomer(e, row) {
    e.stopPropagation();
    // could pass customer data using router link without showing it in url but wanted to show that i can use services ;)
    this.shareData.customer = row;
    this.router.navigate(["/add-customer"]);
  }
}
