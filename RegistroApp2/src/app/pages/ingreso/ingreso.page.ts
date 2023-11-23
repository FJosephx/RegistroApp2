import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.page.html',
  styleUrls: ['./ingreso.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class IngresoPage implements OnInit {

  correo = '';
  password = '';


  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  ingresar() {
    this.authService.login(this.correo, this.password);
  }

  recuperarContrasenia() {
    this.router.navigate(['/correo']);
  }

  registrarse() {
    this.router.navigate(['/registro']);
  }

  changeColor(inputType: string) {
    const element = document.querySelector(`ion-input[label="${inputType}"] label`);
    if (element) {
      element.classList.add('green');
    }
  }

  resetColor(inputType: string) {
    const element = document.querySelector(`ion-input[label="${inputType}"] label`);
    if (element) {
      element.classList.remove('green');
    }
  }


}
