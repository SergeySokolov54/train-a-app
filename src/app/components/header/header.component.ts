import { Component } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule
  ],
  template: `
    <main>
      <div class="header" [ngSwitch]="userService.currentUserStatus">
        <!-- Неавторизованный -->
        <div class="indents" *ngSwitchCase="'anon'">
          <button routerLink="home" mat-button>Home</button>
          <button routerLink="authorization" mat-button>Sign In</button>
          <button routerLink="registration" mat-button>Sign Up</button>
        </div>

        <!-- Авторизованный -->
        <div class="indents" *ngSwitchCase="'auth'">
          <button routerLink="home" mat-button>Home</button>
          <button routerLink="profile" mat-button>Profile</button>
          <button routerLink="orders" mat-button>My orders</button>
          <button routerLink="home" (click)="signOutAndReset()" mat-button>Sign Out</button>
          <span routerLink="profile" class="welcome-message" *ngIf="userService.currentUser">
            {{ userService.currentUser.name }}
          </span>
        </div>

        <!-- Админ -->
        <div class="indents" *ngSwitchCase="'admin'">
          <span class="welcome-message" *ngIf="userService.currentUser">
            Welcome, Admin {{ userService.currentUser.name }}
          </span>
          <button routerLink="home" mat-button>Home</button>
          <button routerLink="profile" mat-button>Profile</button>
          <button routerLink="orders" mat-button>Orders</button>
          <button routerLink="admin" mat-button>Admin Panel</button>
          <button (click)="userService.signOut()" mat-button>Sign Out</button>
        </div>
      </div>
    </main>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(public userService: UserService) {}
  signOutAndReset() {
    this.userService.signOut();
  }
}