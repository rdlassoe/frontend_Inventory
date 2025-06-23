import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User, CreateUserDto } from '../../core/models/user.model';
import { Person } from '../../core/models/persona.model';
import { userService } from '../../core/services/user/user.service';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario',
  imports: [HeaderComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UsuarioComponent implements OnInit {
  users: User[] = [];
  persons: Person[] = [];
  userForm!: FormGroup;
  paginaActual: number = 1;
  productosPorPagina: number = 10;
  mostrarFormulario: boolean = false;


  constructor(
    private userService: userService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']); // redirige si no hay token
      return;
    }
    this.loadUsers();
    this.loadPersons();
    this.initForm();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(users => this.users = users);
  }

  loadPersons() {
    this.userService.findAllEmpleados().subscribe(persons => this.persons = persons);
  }


  initForm() {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
      persona_id: [null, Validators.required],
    });
  }

  get usuariosPaginados(): User[] {
    const inicio = (this.paginaActual - 1) * this.productosPorPagina;
    const fin = inicio + this.productosPorPagina;
    return this.users.slice(inicio, fin);
  }


  get totalPaginas(): number {
    return Math.ceil(this.users.length / this.productosPorPagina);
  }

  cambiarPagina(pagina: number) {
  if (pagina < 1 || pagina > this.totalPaginas) return;
  this.paginaActual = pagina;
}

  onSubmit() {
    if (this.userForm.invalid) return;

    const formValue = this.userForm.value;

    const newUser: CreateUserDto = {
      ...formValue,
      persona_id: Number(formValue.persona_id),
    };

    console.log(newUser);

    this.userService.createUser(newUser).subscribe(() => {
      this.loadUsers();
      this.userForm.reset();
    });
  }
}
