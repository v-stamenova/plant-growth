export default class Observation {
  private date: string;

  private coverage: number;

  private height: number;

  private column: number;

  private row: number;

  private ndvi: number;
    
  private dap: number;

  public constructor(
    date: string,
    coverage: number,
    height: number,
    column: number,
    row: number,
    ndvi: number,
    dap: number
  ) {
    this.date = date;
    this.column = column;
    this.row = row;
    this.coverage = coverage;
    this.height = height;
    this.ndvi = ndvi;
    this.dap = dap;
  }

  public getDate(): string {
    return this.date;
  }

  public getCoverage(): number {
    return this.coverage;
  }

  public getHeight(): number {
    return this.height;
  }

  public getRow(): number {
    return this.row;
  }

  public getColumn(): number {
    return this.column;
  }

  public getNDVI(): number {
    return this.ndvi;
  }

  public getDAP(): number {
    return this.dap;
  }
}
