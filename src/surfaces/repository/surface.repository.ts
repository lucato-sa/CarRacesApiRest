export type Surface = {
  SurfaceId?: number;
  Alias: string;
  Descripcion: string;
};

export class SurfaceRepository {
  private surfaces: Surface[] = [
    { SurfaceId: 1, Alias: 'Asfalto', Descripcion: 'Pista de asfalto' },
  ];

  getAll(): Surface[] {
    return this.surfaces.slice();
  }

  getById(id: number): Surface | undefined {
    return this.surfaces.find(s => s.SurfaceId === id);
  }

  create(surface: Omit<Surface, 'SurfaceId'>): Surface {
    const newId = Math.max(0, ...this.surfaces.map(s => s.SurfaceId || 0)) + 1;
    const newSurface: Surface = { ...surface, SurfaceId: newId };
    this.surfaces.push(newSurface);
    return newSurface;
  }
}
