import {FormControl} from '@angular/forms';

export class Parameter {
  name: string;
  change: FormControl;
  type: string;

  constructor(name: string, change: FormControl, type: string) {
    this.name = name;
    this.change = change;
    this.type = type;
  }
}
