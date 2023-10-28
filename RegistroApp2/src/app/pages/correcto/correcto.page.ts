import { CommonModule } from '@angular/common';
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { DataBaseService } from 'src/app/services/data-base.service';
import { ActivatedRoute } from '@angular/router';


@Component({

  selector: 'app-correcto',
  templateUrl: 'correcto.page.html',
  styleUrls: ['correcto.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule, FormsModule,],
  standalone: true,

})
export class CorrectoPage implements OnInit {

  constructor(private authService: AuthService, private router: Router, private bd: DataBaseService, private toastController: ToastController, private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params: any) => {
      this.password = params['password'];
    });
  }

  password = '';

  ngOnInit() {

  }



}


