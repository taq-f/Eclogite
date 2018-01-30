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

  getSrc(diff: FileDiff) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `data:image/png;base64,${this.diff.binaryContent.toString('base64')}`
    );
  }
}
