export type Club = {
  ClubId?: number;
  Alias: string;
  TaxNombre: string;
  TaxNumero: string;
  Descripcion: string;
  FechaFundacion: string;
  default?: boolean;
};

/**
 * Repository para gestionar la persistencia de Clubs en memoria.
 * Implementa operaciones CRUD sin lógica de negocio.
 */
export class ClubRepository {
  private clubs: Club[] = [
    {
      ClubId: 1,
      Alias: 'ClubRacing',
      TaxNombre: 'Racing SL',
      TaxNumero: 'B12345678',
      Descripcion: 'Club de pruebas',
      FechaFundacion: '1995-06-15',
      default: true,
    },
  ];

  /**
   * Obtiene todos los clubs.
   */
  getAll(): Club[] {
    return this.clubs.slice();
  }

  /**
   * Obtiene un club por ID.
   */
  getById(id: number): Club | undefined {
    return this.clubs.find(c => c.ClubId === id);
  }

  /**
   * Crea un nuevo club.
   */
  create(club: Omit<Club, 'ClubId'>): Club {
    const newId = Math.max(0, ...this.clubs.map(c => c.ClubId || 0)) + 1;
    const newClub: Club = { ...club, ClubId: newId };
    this.clubs.push(newClub);
    return newClub;
  }

  /**
   * Actualiza un club existente.
   */
  update(id: number, club: Partial<Club>): Club | undefined {
    const existing = this.clubs.find(c => c.ClubId === id);
    if (!existing) return undefined;
    Object.assign(existing, club);
    return existing;
  }

  /**
   * Elimina un club por ID.
   */
  delete(id: number): boolean {
    const idx = this.clubs.findIndex(c => c.ClubId === id);
    if (idx === -1) return false;
    this.clubs.splice(idx, 1);
    return true;
  }
}
