export type DrivingEnvironment = {
  DrivingEnviromentId?: number;
  Alias: string;
  Descripcion: string;
  default?: boolean;
};

export class DrivingEnvironmentRepository {
  private environments: DrivingEnvironment[] = [
    { DrivingEnviromentId: 1, Alias: 'Principiante', Descripcion: 'Para conductores principiantes', default: true },
  ];

  getAll(): DrivingEnvironment[] {
    return this.environments.slice();
  }

  getById(id: number): DrivingEnvironment | undefined {
    return this.environments.find(e => e.DrivingEnviromentId === id);
  }

  create(env: Omit<DrivingEnvironment, 'DrivingEnviromentId'>): DrivingEnvironment {
    const newId = Math.max(0, ...this.environments.map(e => e.DrivingEnviromentId || 0)) + 1;
    const newEnv: DrivingEnvironment = { ...env, DrivingEnviromentId: newId };
    this.environments.push(newEnv);
    return newEnv;
  }
}
