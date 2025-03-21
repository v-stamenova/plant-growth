/* eslint-disable @typescript-eslint/typedef */
import { parse } from 'csv-parse/sync';
import Observation from '../objects/Observation.js';
import Field from '../objects/Field.js';

export default class DataReader {
  private filePath: string;

  private observations: Observation[];
  
  public constructor(filePath: string) {
    this.filePath = filePath;
    this.observations = [];
  }

  /**
   *
   */
  public async load(): Promise<Field[]> {
    const response = await fetch(this.filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    
    const text = await response.text();
    const data: string[][] = this.parseCSV(text);
    const rows = data.slice(1);
    
    return this.parseField(rows);
  }

  private parseCSV(csvText: string): string[][] {
    return csvText
      .trim()
      .split('\n')
      .map(row => row.split(',').map(cell => cell.trim()));
  }

  private parseField(rows: string[][]) {
    const fieldObservationsMap: Map<string, Observation[]> = new Map();

    for (const row of rows) {
      const fieldNumber: string | undefined = row[3];
      const observation = new Observation(
        row[5]!,
        Number.parseFloat(row[7]!),
        Number.parseFloat(row[8]!),
        Number.parseFloat(row[19]!),
        Number.parseFloat(row[18]!),
      );
  
      if (fieldNumber && !fieldObservationsMap.has(fieldNumber)) {
        fieldObservationsMap.set(fieldNumber, []);
      } else if (fieldNumber) {
        fieldObservationsMap.get(fieldNumber)!.push(observation);
      }
    }

    const fields: Field[] = [];
    for (const [fieldNumber, observations] of fieldObservationsMap.entries()) {
      const field = new Field(fieldNumber, 100, 100, 20, observations);
      fields.push(field);
    }
    return fields;
  }
}
    
