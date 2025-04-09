import { inject, Injectable, Type, ComponentRef } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ModalContainerComponent } from '@app/shared/components/modal-container/modal-container.component';
import { Observable, Subject } from 'rxjs';

interface ModalConfig {
  width?: string;
  hasBackdrop?: boolean;
  disableClose?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  private overlayRef?: OverlayRef;
  private overlay = inject(Overlay);

  open<T>(component: Type<T>, config: ModalConfig = {}) {
    console.log("Intentando abrir modal con contenido:", component.name);

    this.overlayRef = this.overlay.create({
      width: config.width || '500px',
      hasBackdrop: config.hasBackdrop !== false,
      backdropClass: 'modal-backdrop',
      panelClass: 'modal-panel',
    });

    const portal = new ComponentPortal(ModalContainerComponent);
    const modalComponentRef: ComponentRef<ModalContainerComponent> = this.overlayRef.attach(portal);

    modalComponentRef.instance.loadComponent(component);

    if (!config.disableClose) {
      this.overlayRef.backdropClick().subscribe(() => this.close());
    }
  }

  openWithResult<T>(component: Type<T>, config: ModalConfig = {}, data?: Partial<T>): Observable<any> {
    const result$ = new Subject<any>();

    this.overlayRef = this.overlay.create({
      width: config.width || '500px',
      hasBackdrop: config.hasBackdrop !== false,
      backdropClass: 'modal-backdrop',
      panelClass: 'modal-panel',
    });

    const portal = new ComponentPortal(ModalContainerComponent);
    const modalComponentRef = this.overlayRef.attach(portal);

    modalComponentRef.instance.loadComponent(component, data);

    if (!config.disableClose) {
      this.overlayRef.backdropClick().subscribe(() => {
        result$.next(false);
        result$.complete();
        this.close();
      });
    }

    setTimeout(() => {
      const innerComponent = modalComponentRef.instance.innerComponentRef?.instance as any;
      if (innerComponent) {
        innerComponent.modalClose = (value: any) => {
          result$.next(value);
          result$.complete();
          this.close();
        };
      } else {
        console.warn('No se pudo acceder al componente interno del modal');
      }
    });
    
    return result$.asObservable();
  }

  close() {
    this.overlayRef?.dispose();
  }
}
