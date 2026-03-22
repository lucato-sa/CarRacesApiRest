"use strict";
/**
 * 🗄️ Rule Repository - SQL Nativo con 'pg'
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleRepository = void 0;
const data_source_1 = require("../../database/data-source");
const database_config_1 = require("../../config/database.config");
class RuleRepository {
    async getAll() {
        const query = `
      SELECT rule_id, rulebook_id, rule_code, descripcion, created_at, updated_at
      FROM rules
      ORDER BY rule_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query);
        return rows.map(row => (0, database_config_1.dbToDto)('rules', row));
    }
    async getById(id) {
        const query = `
      SELECT rule_id, rulebook_id, rule_code, descripcion, created_at, updated_at
      FROM rules
      WHERE rule_id = $1
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [id]);
        return row ? (0, database_config_1.dbToDto)('rules', row) : undefined;
    }
    async getByRulebookId(rulebookId) {
        const query = `
      SELECT rule_id, rulebook_id, rule_code, descripcion, created_at, updated_at
      FROM rules
      WHERE rulebook_id = $1
      ORDER BY rule_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query, [rulebookId]);
        return rows.map(row => (0, database_config_1.dbToDto)('rules', row));
    }
    async create(rule) {
        if (!rule.RulebookId || !rule.RuleCode || !rule.Descripcion) {
            throw new Error('Missing required fields: RulebookId, RuleCode, Descripcion');
        }
        const query = `
      INSERT INTO rules (rulebook_id, rule_code, descripcion, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING rule_id, rulebook_id, rule_code, descripcion, created_at, updated_at
    `;
        const params = [rule.RulebookId, rule.RuleCode, rule.Descripcion];
        const row = await (0, data_source_1.queryOne)(query, params);
        return row ? (0, database_config_1.dbToDto)('rules', row) : {};
    }
    async update(id, rule) {
        const setClauses = [];
        const params = [];
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
        const row = await (0, data_source_1.queryOne)(query, params);
        return row ? (0, database_config_1.dbToDto)('rules', row) : undefined;
    }
    async delete(id) {
        const query = `DELETE FROM rules WHERE rule_id = $1`;
        const result = await (0, data_source_1.executeQuery)(query, [id]);
        return result.rowCount > 0;
    }
}
exports.RuleRepository = RuleRepository;
