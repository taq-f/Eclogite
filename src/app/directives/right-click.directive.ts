import { Directive, EventEmitter, HostListener, Input, Output, ElementRef, OnInit } from '@angular/core';
import { remote } from 'electron';
import { ContextMenuOptions } from '../models/context';

@Directive({
  selector: '[appRightClick]'
})
export class RightClickDirective implements OnInit {
  @Input('appRightClick') options: ContextMenuOptions;
  menu = new remote.Menu();

  ngOnInit(): void {
    for (const option of this.options) {
      const item = new remote.MenuItem(option);
      this.menu.append(item);
    }
  }

  @HostListener('contextmenu', ['$event']) onContextMenu(event: Event): void {
    event.preventDefault();
    this.menu.popup(remote.getCurrentWindow());
  }
}
