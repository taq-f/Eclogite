import { extname } from 'path';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, Input, OnInit } from '@angular/core';
import { FileDiff } from '../../models/diff';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-binarydiff',
  templateUrl: './binarydiff.component.html',
  styleUrls: ['./binarydiff.component.scss']
})
export class BinarydiffComponent implements OnInit {
  @Input()diff: FileDiff;

  constructor(
    private logger: LoggerService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.logger.info('Previewing diff:', this.diff);
  }

  getSrc(buffer: Buffer) {
    const ext = extname(this.diff.path); // TODO unrecognized extension
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `data:image/${ext};base64,${buffer.toString('base64')}`
    );
  }
}
