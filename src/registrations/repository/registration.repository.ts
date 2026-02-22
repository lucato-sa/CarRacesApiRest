export type Registration = {
  RegistrationId?: number;
  CompetitionId: number;
  UserId: number;
  FechaRegistro: string;
  Estado: string;
};

export class RegistrationRepository {
  private registrations: Registration[] = [
    { RegistrationId: 1, CompetitionId: 100, UserId: 1, FechaRegistro: '2026-03-01', Estado: 'Activo' },
  ];

  getAll(): Registration[] {
    return this.registrations.slice();
  }

  getById(id: number): Registration | undefined {
    return this.registrations.find(r => r.RegistrationId === id);
  }

  create(registration: Omit<Registration, 'RegistrationId'>): Registration {
    const newId = Math.max(0, ...this.registrations.map(r => r.RegistrationId || 0)) + 1;
    const newReg: Registration = { ...registration, RegistrationId: newId };
    this.registrations.push(newReg);
    return newReg;
  }

  delete(id: number): boolean {
    const index = this.registrations.findIndex(r => r.RegistrationId === id);
    if (index === -1) return false;
    this.registrations.splice(index, 1);
    return true;
  }
}
