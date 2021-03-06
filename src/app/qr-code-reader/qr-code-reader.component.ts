import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';

declare var M: any;

@Component({
    selector: 'app-qr-code-reader',
    templateUrl: './qr-code-reader.component.html',
    styleUrls: ['./qr-code-reader.component.css']
})
export class QrCodeReaderComponent implements OnInit {

    @Output()
    scanned = new EventEmitter<string>();

    @Output()
    errorThrown = new EventEmitter<string>();

    codeReader = new BrowserQRCodeReader();

    videoInputDevices: MediaDeviceInfo[];

    selectedMediaDeviceInfo: MediaDeviceInfo;

    useVideo: boolean;

    scannerControls: IScannerControls;

    @ViewChild('qrModal', { static: true })
    qrModalRef: ElementRef;

    qrModal;

    @ViewChild('fileInput', { static: true })
    fileInputRef: ElementRef;

    constructor() { }

    ngOnInit() {
        BrowserQRCodeReader.listVideoInputDevices()
            .then(videoInputDevices => {
                if (videoInputDevices.length > 0) {
                    this.useVideo = true;
                    this.videoInputDevices = videoInputDevices;
                }
            })
            .catch(err => {
                console.error(err);
                this.useVideo = false;
            });

        const elem = this.qrModalRef.nativeElement;
        this.qrModal = M.Modal.init(elem, {
            onCloseEnd: () => {
                this.selectedMediaDeviceInfo = null;
            }
        });
    }

    decodeFromFile() {
        this.fileInputRef.nativeElement.click();
    }

    onPictureChange(event) {
        const fileList: FileList = event.target.files;
        if (fileList && fileList.length > 0) {
            const file = fileList[0];
            const imgSrc = URL.createObjectURL(file);
            this.codeReader.decodeFromImageUrl(imgSrc).then(result => {
                this.scanned.emit(result.getText());
            }).catch(err => {
                console.error(err);
                this.errorThrown.emit(err);
            });
        }
    }

    decodeFromVideo() {
        this.qrModal.open();
    }

    decodeFromVideoDevice(deviceInfo: MediaDeviceInfo) {
        this.selectedMediaDeviceInfo = deviceInfo;
        this.codeReader.decodeFromVideoDevice(deviceInfo.deviceId, 'video', (result) => {
            if (result) {
                this.scanned.emit(result.getText());
                this.stopDecodeFromVideoDevice();
            }
        })
            .then(scannerControls => {
                this.scannerControls = scannerControls;
            }).catch(reason => {
                console.error(reason);
                this.errorThrown.emit(reason);
            });
    }

    stopDecodeFromVideoDevice() {
        if (this.scannerControls) {
            this.scannerControls.stop();
        }
        this.selectedMediaDeviceInfo = null;
        this.qrModal.close();
    }

}
