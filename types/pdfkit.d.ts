declare module "pdfkit" {
  import { EventEmitter } from "events";

  interface TextOptions {
    continued?: boolean;
    width?: number;
    ellipsis?: boolean;
  }

  class PDFDocument extends EventEmitter {
    x: number;
    y: number;
    constructor(options?: object);
    text(text: string, x?: number, y?: number, options?: TextOptions): this;
    moveDown(lines?: number): this;
    fontSize(size: number): this;
    font(name: string): this;
    fillColor(color: string): this;
    addPage(options?: object): this;
    save(): this;
    restore(): this;
    rect(x: number, y: number, w: number, h: number): this;
    end(): void;
    pipe<T extends NodeJS.WritableStream>(destination: T): T;
  }

  export default PDFDocument;
}
