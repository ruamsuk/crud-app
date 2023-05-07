import { Component, Inject, OnInit } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { HotToastService } from '@ngneat/hot-toast';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-emp-add-edit',
  templateUrl: './emp-add-edit.component.html',
  styleUrls: ['./emp-add-edit.component.scss']
})
export class EmpAddEditComponent implements OnInit {
  education: string[] = [
    'Metric',
    'Diploma',
    'Intermediate',
    'Graduate',
    'Post Graduate'
  ];
  empForm: FormGroup;

  constructor(
    private dialogRef: DialogRef<EmpAddEditComponent>,
    private fb: FormBuilder,
    private userService: UserService,
    private toast: HotToastService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.empForm = new FormGroup({
      id: new FormControl(null),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl(''),
      dob: new FormControl(''),
      gender: new FormControl(''),
      education: new FormControl(''),
      company: new FormControl(''),
      experience: new FormControl(''),
      package: new FormControl(''),
    });
  }

  ngOnInit() {
    // this.empForm.patchValue(this.data);
    if (this.data) {
      this.empForm.setValue({
        ...this.data,
        id: this.data.id,
        dob: this.data.dob.toDate() // ถ้าไม่ทำแบบนี้ในฟอร์ม จะไม่ขึ้นวันเดือนปี
      });
    }

  }

  onFromSubmit() {
    if (this.empForm.invalid) return;

    const userData = this.empForm.value;

    if (this.data) {  // update
      const user = {...userData, id: this.data.id};
      this.userService.updateUser(user).pipe(
        this.toast.observe({
          loading: 'loading...',
          success: 'Updated user success',
          error: ({message}) => `${message}`
        })
      ).subscribe(() => this.closeDialog());
    } else {  // add new
      this.userService.addUser(userData)
        .pipe(
          this.toast.observe({
            loading: 'loading...',
            success: 'Add new user success',
            error: ({message}) => `${message}`
          })
        )
        .subscribe(() => {
          this.closeDialog();
        });
    }
  }

  closeDialog() {
    this.empForm.reset();
    this.dialogRef.close();
  }
}
