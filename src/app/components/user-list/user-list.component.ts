import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { UserData } from 'src/app/models/UserData.models';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  userPage = 1;
  users: any[] = [];
  selectedUsers: any[] = [];
  enteredValue: any;
  selectAllPerPage: boolean[] = [];
  filteredUsers: any[] = [];
  itemsPerPage = 10;
  totalPages: number= 0;

  constructor(private userService: UserService,  public router: Router) {
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
      this.filteredUsers = this.users
      // Calculate total pages
      this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    });
  }

  applyFilter() {
    console.log('enteredValue', this.enteredValue)
    if (!this.enteredValue) {
      this.filteredUsers = this.users;
      // Calculate total pages
      this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    } else {
      this.filteredUsers = this.users.filter(user =>
        user.name.toLowerCase().includes(this.enteredValue.toLowerCase()) ||
        user.email.toLowerCase().includes(this.enteredValue.toLowerCase()) ||
        user.role.toLowerCase().includes(this.enteredValue.toLowerCase())
      );

      this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    }
  }

  pageChanged(event: number): void {
    this.userPage = event;
  }

  enableEdit(user: UserData) {
    user.isEditable = true;
  }

  // Method to disable edit mode and save changes
  save(user: UserData) {
    user.isEditable = false;
    for (let i = (this.userPage - 1) * 10; i < ((this.userPage - 1) * 10) + 10 && i < this.users.length; i++) {
      if(this.users[i].id == user.id){
        this.users[i] = user
        this.filteredUsers[i] = this.selectedUsers[i] = user
      }
    }
  }

  // Method to cancel edit mode without saving changes
  cancelEdit(user: UserData) {
    user.isEditable = false;
  }

  deleteUser(element: UserData) {
    this.users = this.users.filter(item => item.id !== element.id)
    this.filteredUsers = this.users;
    console.log('Deleting user:', element);
  }

  handlePageChange(event: any) {
    this.userPage = event;
  }

  toggleSelection(user: any) {
    user.isSelected = !user.isSelected;
    console.log('user ', user)
    if (user.isSelected) {
      this.selectedUsers.push(user)
    } else {
      this.selectedUsers = this.selectedUsers.filter(item => item.id !== user.id);
    }
  }

  HandleAllSelected(id: any) {
    if (!this.selectAllPerPage[id]) {
      for (let i = (id - 1) * 10; i < ((id - 1) * 10) + 10 && i < this.users.length; i++) {
        this.users[i].isSelected = true
        this.selectedUsers.push(this.users[i])
      }
    } else {
      for (let i = (id - 1) * 10; i < ((id - 1) * 10) + 10 && i < this.users.length; i++) {
        this.users[i].isSelected = false
      }
      this.selectedUsers = this.users.filter(id=> id.isSelected)
    }

    console.log('users ', this.selectedUsers)
  }

  deleteAll(){
    this.users = this.users.filter(id=>!id.isSelected)
    for(let i=0; i < this.selectAllPerPage.length; i++){
      if(this.selectAllPerPage[i]){
        this.selectAllPerPage[i] = false
      }
    }
    this.applyFilter()
    this.selectedUsers = []
  }
}
