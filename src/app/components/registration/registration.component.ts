import { Component } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  template: `
    <div class="reg-container">
      <h2>Sign Up</h2>
      <form (ngSubmit)="onSubmit()">
        <mat-form-field>
          <input matInput placeholder="Name" [(ngModel)]="name" name="name" required>
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Email" [(ngModel)]="email" name="email" required>
        </mat-form-field>
        <mat-form-field>
          <input matInput type="password" placeholder="Password" [(ngModel)]="password" name="password" required>
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit">Sign Up</button>
      </form>
    </div>
  `,
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  name: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit() {
    try {
      const emailExists = this.userService.users.some(u => u.email === this.email);
      
      if (emailExists) {
        throw new Error('User with this email already exists');
      }
      
      this.userService.signUp({
        name: this.name,
        email: this.email,
        password: this.password
      });
      
      this.router.navigate(['/home']);
    } catch (error: unknown) {
      let errorMessage = 'Registration failed';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      this.snackBar.open(errorMessage, 'Close', {
        duration: 3000
      });
    }
  }
}