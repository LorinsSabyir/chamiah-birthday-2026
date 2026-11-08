import { Component } from '@angular/core';

@Component({
  selector: 'app-things-i-love',
  standalone: false,
  template: '<app-memory-albums />',
  styles: ':host { display: block; width: 100%; height: 100%; min-height: 0; }',
})
export class ThingsILoveComponent {}
