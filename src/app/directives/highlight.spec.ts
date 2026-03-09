import { ElementRef } from '@angular/core';
import { HighlightDirective } from './highlight';

describe('HighlightDirective', () => {
  it('should create an instance', () => {
    const directive = new HighlightDirective({
      nativeElement: document.createElement('div')
    } as ElementRef);
    expect(directive).toBeTruthy();
  });
});
