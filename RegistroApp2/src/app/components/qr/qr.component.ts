import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { IonicModule, LoadingController, AnimationController } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';
import { Asistencia } from 'src/app/model/asistencia';
import { AuthService } from 'src/app/services/auth.service';
import jsQR, { QRCode } from 'jsqr';
import { BehaviorSubject } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { showAlertDUOC, showAlertYesNoDUOC } from 'src/app/tools/message-routines';
import { BarcodeFormat, BarcodeScanner, ScanResult } from '@capacitor-mlkit/barcode-scanning';
import { MessageEnum } from 'src/app/tools/message-enum';
import { SQLiteService } from 'src/app/services/sqlite.service';
import { DataBaseService } from 'src/app/services/data-base.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
  standalone: true,
})
export class QrComponent implements OnInit, AfterViewInit {

  @ViewChild('video') private video!: ElementRef;
  @ViewChild('canvas') private canvas!: ElementRef;
  @Output() qrCapturado: EventEmitter<string> = new EventEmitter();

  usuario = new Usuario();
  public asistencia: Asistencia = new Asistencia();
  public escaneando = false;
  public datosQR: string = '';
  public datosMiClase = new BehaviorSubject<Asistencia | null>(null);
  plataforma = 'web';

  constructor(
    private authService: AuthService,
    private bd: DataBaseService,
    private sqliteService: SQLiteService,
    private readonly ngZone: NgZone,
    private router: Router,
    private loadingController: LoadingController,
    private animationController: AnimationController
  ) { }

  async ngOnInit() {
    this.plataforma = this.sqliteService.platform;
    this.authService.usuarioAutenticado.subscribe((usuario) => {
      if (usuario !== null) {
        this.usuario = usuario!;
      }
    })
  }

  async comenzarEscaneoQR() {
    if (this.plataforma === 'web') {
      this.comenzarEscaneoQRWeb();
    } else {
      this.comenzarEscaneoQRNativo();
    }
  }
  ngAfterViewInit(): void {
    const welcomeMessage: HTMLElement | null = document.getElementById('welcome-message');
    if (welcomeMessage) {
      const animation = this.animationController
        .create()
        .addElement(welcomeMessage)  // Cambia "this.asistencia" al elemento correcto
        .duration(3000)
        .easing('ease')
        .delay(0)
        .iterations(10)
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



  /**
   *  Proceso de escanéo de QR en un Navegador Web
   */

  public async comenzarEscaneoQRWeb() {
    const mediaProvider: MediaProvider = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    this.video.nativeElement.srcObject = mediaProvider;
    this.video.nativeElement.setAttribute('playsinline', 'true');
    this.video.nativeElement.play();
    this.escaneando = true;
    requestAnimationFrame(this.verificarVideo.bind(this));
  }

  async verificarVideo() {
    if (this.video.nativeElement.readyState === this.video.nativeElement.HAVE_ENOUGH_DATA) {
      if (this.obtenerDatosQR() || !this.escaneando) return;
      requestAnimationFrame(this.verificarVideo.bind(this));
    } else {
      requestAnimationFrame(this.verificarVideo.bind(this));
    }
  }

  public obtenerDatosQR(): boolean {
    const w: number = this.video.nativeElement.videoWidth;
    const h: number = this.video.nativeElement.videoHeight;
    this.canvas.nativeElement.width = w;
    this.canvas.nativeElement.height = h;
    const context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
    context.drawImage(this.video.nativeElement, 0, 0, w, h);
    const img: ImageData = context.getImageData(0, 0, w, h);
    let qrCode: QRCode | null = jsQR(img.data, w, h, { inversionAttempts: 'dontInvert' });
    if (qrCode) {
      const data = qrCode.data;
      if (data !== '') {
        this.escaneando = false;
        if (this.asistencia.verificarAsistenciaDesdeQR(qrCode.data)) {
          this.bd.datosQR.next(qrCode.data);
          this.qrCapturado.emit(qrCode.data);
        } else {
          showAlertDUOC('El código QR escaneado no corresponde a una Asistencia de DUOC');
        }
        return true;
      }
    }
    return false;
  }

  public detenerEscaneoQR(): void {
    this.escaneando = false;
  }

  /**
   *  Proceso de escanéo de QR nativo en Android
   *  Ver: https://github.com/capawesome-team/capacitor-barcode-scanning
   */

  async comenzarEscaneoQRNativo() {
    const datosQR = await this.escanearQRNativo();
    if (datosQR === '') return;
    if (datosQR.includes('Error: ')) {
      showAlertDUOC(datosQR.substring(7));
      return;
    }
    if (this.asistencia.verificarAsistenciaDesdeQR(datosQR)) {
      this.bd.datosQR.next(datosQR);
      this.qrCapturado.emit(datosQR);
    } else {
      showAlertDUOC('El código QR escaneado no corresponde a una Asistencia de DUOC');
    }
  }

  public async escanearQRNativo(): Promise<string> {
    try {
      // Verificar si está instalado Google Barcode Scanner y si no lo instala
      await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable().then(async (result) => {
        if (!result.available) await BarcodeScanner.installGoogleBarcodeScannerModule();
      });

      // Verificar que BarcodeScanner sea soportado por el sistema
      if (!await BarcodeScanner.isSupported())
        return Promise.resolve('ERROR: Google Barcode Scanner no es compatible con este celular');

      // Solicitar permisos para usar la cámara con BarcodeScanner
      let status = await BarcodeScanner.checkPermissions();
      if (status.camera === 'denied') status = await BarcodeScanner.requestPermissions();
      if (status.camera === 'denied') {
        const resp = await showAlertYesNoDUOC('No fue posible otorgar permisos a la cámara. ¿Quiere '
          + 'acceder a las opciones de configuración de la aplicación y darle permiso manualmente?');
        if (resp === MessageEnum.YES) await BarcodeScanner.openSettings();
        return Promise.resolve('');
      }

      // Eliminar oyentes de eventos de BarcodeScanner antes de registrar uno nuevo. 
      await BarcodeScanner.removeAllListeners().then(() => {
        BarcodeScanner.addListener('googleBarcodeScannerModuleInstallProgress', (event) => {
          this.ngZone.run(() => {
            console.log('googleBarcodeScannerModuleInstallProgress', event);
          });
        });
      });

      // Devolver valor del QR capturado
      const { barcodes }: ScanResult = await BarcodeScanner.scan({ formats: [BarcodeFormat.QrCode], });
      return Promise.resolve(barcodes[0].displayValue);
    } catch (error: any) {
      if (error.message.includes('canceled')) return Promise.resolve('');
      return Promise.resolve('ERROR: No fue posible leer el código QR');
    }
  }

}
