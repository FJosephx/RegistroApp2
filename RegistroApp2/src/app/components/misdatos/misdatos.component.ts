import { AuthService } from 'src/app/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnimationController, IonicModule } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';
import { DataBaseService } from 'src/app/services/data-base.service';
import { showAlertDUOC, showToast } from 'src/app/tools/message-routines';

@Component({
  selector: 'app-misdatos',
  templateUrl: './misdatos.component.html',
  styleUrls: ['./misdatos.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
  standalone: true,
})
export class MisdatosComponent implements OnInit {

  title : string= 'Mis datos';
  usuario = new Usuario();
  repeticionPassword = '';

  constructor(
    private authService: AuthService, 
    private bd: DataBaseService, private animationController: AnimationController) { }


  
  async ngOnInit() {
    this.authService.usuarioAutenticado.subscribe((usuario) => {
      if (usuario !== null) {
        this.usuario = usuario!;
        this.repeticionPassword = usuario!.password;
      }
    })
  }

  ngAfterViewInit(): void {
    const welcomeMessage: HTMLElement | null = document.getElementById('misdatos');
    if (welcomeMessage) {
      const animation = this.animationController
        .create()
        .addElement(welcomeMessage)  
        .duration(3000)
        .easing('ease')
        .delay(0)
        .iterations(100)
        .fill('forwards')
        .keyframes([
          { offset: 0, transform: 'scale3d(1,1,1)' },
          { offset: 0.3, transform: 'scale3d(1.25,0.75,1)' },
          { offset: 0.4, transform: 'scale3d(0.75,1.25,1)' },
          { offset: 0.5, transform: 'scale3d(1.15,0.85,1)' },
          { offset: 0.65, transform: 'scale3d(0.95,1.05,1)' },
          { offset: 0.75, transform: 'scale3d(1.05,0.95,1)' },
          { offset: 1, transform: 'scale3d(1,1,1)' },
        ]);

      animation.play();
    }

  }

  mostrarMensaje(nombreCampo:string, valor: string) {
    if (valor.trim() === '') {
      showAlertDUOC(`Debe ingresar un valor para el campo "${nombreCampo}".`);
      return false;
    }
    return true;
  }

  actualizarPerfil() {
    if (!this.mostrarMensaje('nombre', this.usuario.nombre)) return;
    if (!this.mostrarMensaje('apellidos', this.usuario.apellido)) return;
    if (!this.mostrarMensaje('correo', this.usuario.correo)) return;
    if (!this.mostrarMensaje('pregunta secreta', this.usuario.preguntaSecreta)) return;
    if (!this.mostrarMensaje('respuesta secreta', this.usuario.respuestaSecreta)) return;
    if (!this.mostrarMensaje('contraseña', this.usuario.password)) return;
    if (this.usuario.password !== this.repeticionPassword) {
      showAlertDUOC(`Las contraseñas escritas deben ser iguales.`);
      return;
    }
    this.bd.guardarUsuario(this.usuario);
    this.authService.setUsuarioAutenticado(this.usuario);
    showToast('Sus datos fueron actualizados');
  }

}
