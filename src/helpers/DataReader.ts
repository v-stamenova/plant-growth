/* eslint-disable @typescript-eslint/typedef */
import { parse } from 'csv-parse/sync';
import Observation from '../objects/Observation.js';

export default class DataReader {
  private filePath: string;

  private observations: Observation[];
  
  public constructor(filePath: string) {
    this.filePath = filePath;
    this.observations = [];
  }

  public async load(): Promise<Observation[]> {
    const response = await fetch(this.filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    const text = await response.text();
    let data: string[][] = this.parseCSV(text);

    const rows = data.slice(1);

    this.observations = rows.map((row: string[]) => new Observation(row[5]!, Number.parseFloat(row[7]!), Number.parseFloat(row[8]!)));
    return this.observations;
  }

  private parseCSV(csvText: string): string[][] {
    return csvText
      .trim()
      .split('\n')
      .map(row => row.split(',').map(cell => cell.trim()));
  }
}
    
