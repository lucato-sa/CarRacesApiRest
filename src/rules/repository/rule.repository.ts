/**
 * 🗄️ Rule Repository - SQL Nativo con 'pg'
 */

import { queryAll, queryOne, executeQuery } from '../../database/data-source';
import { Rule, CreateRuleInput, UpdateRuleInput, RuleRow } from '../models/rule.model';
import { dbToDto } from '../../config/database.config';

export class RuleRepository {
  
  async getAll(): Promise<Rule[]> {
    const query = `
      SELECT rule_id, rulebook_id, rule_code, descripcion, created_at, updated_at
      FROM rules
      ORDER BY rule_id ASC
    `;
    
    const rows = await queryAll<RuleRow>(query);
    return rows.map(row => dbToDto('rules', row));
  }

  async getById(id: number): Promise<Rule | undefined> {
    const query = `
      SELECT rule_id, rulebook_id, rule_code, descripcion, created_at, updated_at
      FROM rules
      WHERE rule_id = $1
      LIMIT 1
    `;

    const row = await queryOne<RuleRow>(query, [id]);
    return row ? dbToDto('rules', row) : undefined;
  }

  async getByRulebookId(rulebookId: number): Promise<Rule[]> {
    const query = `
      SELECT rule_id, rulebook_id, rule_code, descripcion, created_at, updated_at
      FROM rules
      WHERE rulebook_id = $1
      ORDER BY rule_id ASC
    `;

    const rows = await queryAll<RuleRow>(query, [rulebookId]);
    return rows.map(row => dbToDto('rules', row));
  }

  async create(rule: CreateRuleInput): Promise<Rule> {
    if (!rule.RulebookId || !rule.RuleCode || !rule.Descripcion) {
      throw new Error('Missing required fields: RulebookId, RuleCode, Descripcion');
    }

    const query = `
      INSERT INTO rules (rulebook_id, rule_code, descripcion, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING rule_id, rulebook_id, rule_code, descripcion, created_at, updated_at
    `;

    const params = [rule.RulebookId, rule.RuleCode, rule.Descripcion];

    const row = await queryOne<RuleRow>(query, params);
    return row ? dbToDto('rules', row) : ({} as Rule);
  }

  async update(id: number, rule: UpdateRuleInput): Promise<Rule | undefined> {
    const setClauses: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (rule.RulebookId !== undefined) {
      setClauses.push(`rulebook_id = $${paramCount++}`);
      params.push(rule.RulebookId);
    }
    if (rule.RuleCode !== undefined) {
      setClauses.push(`rule_code = $${paramCount++}`);
      params.push(rule.RuleCode);
    }
    if (rule.Descripcion !== undefined) {
      setClauses.push(`descripcion = $${paramCount++}`);
      params.push(rule.Descripcion);
    }

    setClauses.push(`updated_at = $${paramCount++}`);
    params.push(new Date());
    params.push(id);

    const query = `
      UPDATE rules
      SET ${setClauses.join(', ')}
      WHERE rule_id = $${paramCount}
      RETURNING rule_id, rulebook_id, rule_code, descripcion, created_at, updated_at
    `;

    const row = await queryOne<RuleRow>(query, params);
    return row ? dbToDto('rules', row) : undefined;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM rules WHERE rule_id = $1`;
    const result = await executeQuery(query, [id]);
    return result.rowCount > 0;
  }
}
