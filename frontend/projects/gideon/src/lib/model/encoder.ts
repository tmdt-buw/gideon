export abstract class Encoder {

  // encode non-primitive types
  static encode(value: any): string {
    return value !== Object(value) ? value : JSON.stringify(value);
  }

  // decode non-primitive types
  static decode(value: string): any {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }

  static encodeValues(object: any): any {
    const res = {};
    Object.entries(object).forEach(([key, value]) => res[key] = Encoder.encode(value));
    return res;
  }

}


