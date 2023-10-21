import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
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



  constructor(private authService: AuthService, private router: Router, private bd: DataBaseService, 
    private toastController: ToastController, private activatedRoute: ActivatedRoute) {
      const navigation = this.router.getCurrentNavigation();
      this.activatedRoute.queryParams.subscribe(params => {
      this.preguntaSecreta =params['pregunta'];
      });
    }

  ngOnInit() {
  }
  public preguntaSecreta = '';
  usuario = new Usuario();
  respuestaSecreta = ''; 

  async comprobarRespuesta(respuestaSecreta: string) {
    await this.bd.validarRespuesta(respuestaSecreta).then(async (usuario : Usuario | undefined) => {
      if (usuario){
        showToast(`La respuesta es: ${usuario.respuestaSecreta}`);
        this.router.navigate(['/correcto'], {queryParams : {password: usuario.password}});
        console.log(usuario);
      } else {
        this.router.navigate(['/incorrecto']);
      }
    });
  }

  volverIngreso(){
    this.router.navigate(['/ingreso']);
  }


}
