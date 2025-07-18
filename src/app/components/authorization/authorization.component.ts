import { Component } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-authorization',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule
  ],
  template: `
    <div class="auth-container">
      <h2>Sign In</h2>
      <form (ngSubmit)="onSubmit()">
        <mat-form-field>
          <input matInput placeholder="Email" [(ngModel)]="email" name="email" required>
        </mat-form-field>
        <mat-form-field>
          <input matInput type="password" placeholder="Password" [(ngModel)]="password" name="password" required>
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit">Sign In</button>
      </form>
    </div>
  `,
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent {
  email: string = '';
  password: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit() {
    try {
      const user = this.userService.users.find(u => u.email === this.email);
      
      if (!user) {
        throw new Error('User with this email not found');
      }
      
      if (user.password !== this.password) {
        throw new Error('Incorrect password');
      }
      
      this.userService.signIn({
        email: this.email,
        password: this.password
      });
      
      this.router.navigate(['/home']);
    } catch (error: unknown) {
      let errorMessage = 'Invalid email or password';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      this.snackBar.open(errorMessage, 'Close', {
        duration: 3000
      });
    }
  }
}