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
  private overlayStack: OverlayRef[] = [];
  private overlay = inject(Overlay);

  open<T>(component: Type<T>, config: ModalConfig = {}) {
    console.log("Intentando abrir modal con contenido:", component.name);
    const overlayRef = this.overlay.create({
      width: config.width || '500px',
      hasBackdrop: config.hasBackdrop !== false,
      backdropClass: 'modal-backdrop',
      panelClass: 'modal-panel',
    });

    const portal = new ComponentPortal(ModalContainerComponent);
    const modalComponentRef: ComponentRef<ModalContainerComponent> = overlayRef.attach(portal);

    modalComponentRef.instance.loadComponent(component);

    if (!config.disableClose) {
      overlayRef.backdropClick().subscribe(() => this.close());
    }
    this.overlayStack.push(overlayRef);
  }

  openWithResult<T>(component: Type<T>, config: ModalConfig = {}, data?: Partial<T>): Observable<any> {
    const result$ = new Subject<any>();
  
    const overlayRef = this.overlay.create({
      width: config.width || '500px',
      hasBackdrop: config.hasBackdrop !== false,
      backdropClass: 'modal-backdrop',
      panelClass: 'modal-panel',
    });
  
    this.overlayStack.push(overlayRef); 
  
    const portal = new ComponentPortal(ModalContainerComponent);
    const modalComponentRef = overlayRef.attach(portal);
  
    modalComponentRef.instance.loadComponent(component, data);
  
    if (!config.disableClose) {
      overlayRef.backdropClick().subscribe(() => {
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
          this.close(); // ¡Cierra solo este!
        };
      }
    });
  
    return result$.asObservable();
  }
  

  close() {
    const overlayRef = this.overlayStack.pop(); 
    if (overlayRef) {
      overlayRef.dispose();
    }
  }
  
}
