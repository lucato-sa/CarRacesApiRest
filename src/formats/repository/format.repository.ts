export type Format = {
  FormatId?: number;
  Alias: string;
  Descripcion: string;
};

export class FormatRepository {
  private formats: Format[] = [
    { FormatId: 1, Alias: 'Individual', Descripcion: 'Formato individual' },
  ];

  getAll(): Format[] {
    return this.formats.slice();
  }

  getById(id: number): Format | undefined {
    return this.formats.find(f => f.FormatId === id);
  }

  create(format: Omit<Format, 'FormatId'>): Format {
    const newId = Math.max(0, ...this.formats.map(f => f.FormatId || 0)) + 1;
    const newFormat: Format = { ...format, FormatId: newId };
    this.formats.push(newFormat);
    return newFormat;
  }
}
