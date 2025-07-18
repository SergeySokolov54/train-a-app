import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UserService } from '../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [
    MatCardModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    RouterModule],
  template: `
    <div class="container">
      <mat-card class="centered-card">
        <mat-card-header> 
          <mat-card-title>Profile</mat-card-title> 
        </mat-card-header>
        <mat-card-content>
          <div class="content-header">
            <div class="pos-relative">
              <div *ngIf="isChangePasswordOpen" class="dark-bg">
                <mat-card class="form-change-pswrd">
                  <mat-card-header class="mat-card-header-chnge-pswrd">
                    <mat-icon class="icon-close-chnge-pswrd"aria-hidden="false" aria-label="Example home icon" fontIcon="close" (click)="closeChangePassword()"></mat-icon>
                    <mat-card-title class="title-change-password">Change Password</mat-card-title> 
                  </mat-card-header>
                  <mat-card-content>
                    <div class="container-content-change-pswrd">
                      <mat-card-subtitle>New Password</mat-card-subtitle>
                      <input class="input-change-pswrd" type="text" id="myInput">
                    </div>
                    <button class="btn-save-new-password" mat-button>Save</button>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </div>
          <p>Name</p>
          <div class="edit-icon">
            <input disabled type="text" [value]="userService.currentUser?.name || ''" placeholder="Имя пользователя">
          </div>
          <p>Email</p>
          <div class="edit-icon">
            <input disabled type="text" [value]="userService.currentUser?.email || ''" placeholder="Email&#64;example.com">
          </div>
        </mat-card-content> 
        <mat-card-actions> 
          <button class="btn-logout" routerLink="home" mat-button (click)="userService.signOut()">Logout</button> 
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  constructor(
    public userService: UserService) {
    const service = inject(UserService);
    console.log(service)
  }
  isChangePasswordOpen = false;
  openChangePassword() {
    this.isChangePasswordOpen = true;
  }
  closeChangePassword() {
    this.isChangePasswordOpen = false;
  }
}