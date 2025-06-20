import { Component} from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, ],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend_Inventory';
  constructor(private router: Router) {}

  get isLoginPage(): boolean {
    return this.router.url === '/';
  }
}
