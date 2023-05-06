import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmpAddEditComponent } from './components/emp-add-edit/emp-add-edit.component';
import { UserService } from './services/user.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatTableDataSource } from '@angular/material/table';
import { User } from './models/user.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'no', 'firstName', 'lastName', 'email', 'gender', 'company',
     'dob', 'education', 'experience', 'package', 'action'
  ];
  searchKey: string;
  dataSource: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private toast: HotToastService
  ) {
    this.getAllUsers();
    this.dataSource = new MatTableDataSource<User>();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDialog() {
     this.dialog.open(EmpAddEditComponent);
  }

  getAllUsers() {
    this.userService
      .getUsers()
      .pipe(
        untilDestroyed(this),
        this.toast.observe({
          loading: 'loading...',
          success: 'Get all users success',
          error: ({message}) => `${message}`
        })
      )
      .subscribe(res => {
        this.dataSource = new MatTableDataSource<User>(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchKey = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onSearchClear() {
    this.searchKey = '';
    this.dataSource.filter = this.searchKey;
  }

  onEditUser(data: User) {
    const dialogRef = this.dialog.open(EmpAddEditComponent, { data });
    dialogRef.afterClosed().subscribe(() => data = null)
  }

  deleteMember(row: User) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Delete User',
        message: `Delete: ${row.firstName} ${row.lastName} Sure?`
      }
    });
    confirmDialog.afterClosed()
      .subscribe(res => {
        if (res) {
          let id = row.id;
          this.userService.deleteUser(id)
            .pipe(
              this.toast.observe({
                loading: 'loading...',
                success: 'Deleted Success',
                error: ({message}) => `${message}`
              })
            )
            .subscribe()
        }
      })
  }
}
