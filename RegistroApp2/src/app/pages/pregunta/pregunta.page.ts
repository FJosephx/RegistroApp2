import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { DataBaseService } from 'src/app/services/data-base.service';
import { Usuario } from 'src/app/model/usuario';
import { showToast } from 'src/app/tools/message-routines';

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.page.html',
  styleUrls: ['./pregunta.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PreguntaPage implements OnInit {

  constructor(private authService: AuthService, private router: Router, private bd: DataBaseService, private toastController: ToastController) { }

  ngOnInit() {
  }

  usuario = new Usuario();
  respuestaSecreta = ''; 

  async comprobarRespuesta(respuestaSecreta: string) {
    await this.bd.validarRespuesta(respuestaSecreta).then(async (usuario : Usuario | undefined) => {
      if (usuario){
        showToast(`La respuesta es: ${usuario.respuestaSecreta}`);
        this.router.navigate(['/correcto']);
      } else {
        this.router.navigate(['/incorrecto']);
      }
    });
  }

  volverIngreso(){
    this.router.navigate(['/ingreso']);
  }

}
