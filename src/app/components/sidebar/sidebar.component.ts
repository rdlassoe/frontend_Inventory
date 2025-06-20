import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  [x: string]: any;
  @Output() closeSidebar = new EventEmitter<void>();

  constructor(private router: Router) { }

  onClose() {
    this.closeSidebar.emit();
  }

  logout() {
    // Limpia token si usas uno
    localStorage.removeItem('token'); // o authService.logout() si lo tienes

    // Redirige al login
    this.router.navigate(['/login']);

    // Cierra la sidebar
    this.onClose();
    
  }
  
}

