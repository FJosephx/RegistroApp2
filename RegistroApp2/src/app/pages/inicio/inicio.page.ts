import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnimationController, IonicModule } from '@ionic/angular';
import { QrComponent } from 'src/app/components/qr/qr.component';
import { MiclaseComponent } from 'src/app/components/miclase/miclase.component';
import { ForoComponent } from 'src/app/components/foro/foro.component';
import { MisdatosComponent } from 'src/app/components/misdatos/misdatos.component';
import { DataBaseService } from 'src/app/services/data-base.service';
import { APIClientService } from 'src/app/services/apiclient.service';
import { AdminComponent } from 'src/app/components/admin/admin.component';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,
    QrComponent, MiclaseComponent, ForoComponent, MisdatosComponent,AdminComponent
  ],
})
export class InicioPage implements OnInit {

  componente_actual = 'qr';

  constructor(
    private authService: AuthService, 
    private bd: DataBaseService,
    private api: APIClientService,
    private animationController: AnimationController){}

  ngOnInit() {
    this.componente_actual = 'qr';
    this.bd.datosQR.next('');
  }

  
  isAdmin(): boolean{
    return this.authService.userRole === 'admin';
  }

  ngAfterViewInit(): void {
    const tittleElement: HTMLElement | null = document.getElementById('titulo');
    if (tittleElement) {
      const animation = this.animationController
        .create()
        .addElement(tittleElement)
        .duration(3000)
        .easing('ease')
        .delay(0)
        .iterations(100)
        .fill('forwards')
        .keyframes([
          { offset: 0, transform: 'translateX(-100%)' },
          { offset: 0.9, transform: 'translateX(0%)' },
          { offset: 1, transform: 'translateX(100%)' },
        ]);

      animation.play();
    }

  }

  cambiarComponente(nombreComponente: string) {
    this.componente_actual = nombreComponente;
    if (this.componente_actual === 'foro') this.api.cargarPublicaciones();
    if (this.componente_actual === 'misdatos') this.authService.leerUsuarioAutenticado();
  }

  cerrarSesion() {
    this.authService.logout();
  }
}
