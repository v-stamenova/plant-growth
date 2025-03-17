export default class Observation {
    private date: string;
    private coverage: number;
    private height: number;

    public constructor(date: string, coverage: number, height: number) {
        this.date = date;
        this.coverage = coverage;
        this.height = height;
    }

    public getCoverage(): number {
        return this.coverage;
    }

    public getHeight(): number {
        return this.height;
    }
} 