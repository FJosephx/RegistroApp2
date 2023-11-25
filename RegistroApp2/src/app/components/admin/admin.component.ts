import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { DataBaseService } from 'src/app/services/data-base.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
  standalone: true,
})
export class AdminComponent implements OnInit {
  usuariosRegistrados: any[] = [];
  usuario: Usuario | null = null;
  adm = false;


  constructor(private authService: AuthService, private sqliteService: DataBaseService) {}

  ngOnInit() {
    this.authService.usuarioAutenticado.subscribe((usuario) => {
        this.usuario = usuario;
      if (this.usuario?.nombre?.toLowerCase() === 'admin') {
        this.adm= true;
      }else{
        this.adm = false;
      }
    });

    this.obtenerUsuariosRegistrados();
  }



  obtenerUsuariosRegistrados() {
    this.sqliteService.getUsuariosRegistrados().then((usuarios) => {
      this.usuariosRegistrados = usuarios;
    });
  }

  eliminarUsuario(usuario: any) {
    this.sqliteService.eliminarUsuarioUsandoCorreo(usuario.correo).then(() => {
      this.obtenerUsuariosRegistrados();
    });
  }

}
