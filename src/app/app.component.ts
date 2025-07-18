import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  template: `
    <router-outlet></router-outlet>
`,
  styleUrl: './app.component.scss'
})
export class AppComponent {

}
