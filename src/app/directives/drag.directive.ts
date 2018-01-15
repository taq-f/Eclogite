import { Directive, EventEmitter, HostListener, Output, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDrag]'
})
export class DragDirective {
  @Output() dragging = new EventEmitter<{ x: number, y: number }>();

  private isDragging = false;
  private previous: { x: number, y: number };

  @HostListener('mousedown', ['$event']) onMouseDown(event): void {
    this.isDragging = true;
    this.previous = { x: event.pageX, y: event.pageY };
  }

  @HostListener('document:mousemove', ['$event']) onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      const prev = this.previous;
      this.dragging.emit({
        x: event.pageX - prev.x,
        y: event.pageY - prev.y,
      });
      this.previous = { x: event.pageX, y: event.pageY };
    }
  }

  @HostListener('mouseup', ['$event']) onMouseUp1(): void {
    this.isDragging = false;
  }
  @HostListener('document:mouseup', ['$event']) onMouseUp2(): void {
    this.isDragging = false;
  }
}
