/**
 * 📋 Rule Model - Tipos TypeScript (sin decoradores de ORM)
 */

export interface Rule {
  RuleId?: number;
  RulebookId: number;
  RuleCode: string;
  Descripcion: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export type CreateRuleInput = Omit<Rule, 'RuleId' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateRuleInput = Partial<Omit<Rule, 'RuleId' | 'CreatedAt' | 'UpdatedAt'>>;

export interface RuleRow {
  rule_id: number;
  rulebook_id: number;
  rule_code: string;
  descripcion: string;
  created_at?: Date;
  updated_at?: Date;
}
