"use strict";
/**
 * 📦 INDEX - Exporta todos los backends
 * Uso: import { MemoryBackend, FileBackend, ... } from './backends'
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseBackend = exports.PostgresBackend = exports.FileBackend = exports.MemoryBackend = void 0;
var MemoryBackend_1 = require("./MemoryBackend");
Object.defineProperty(exports, "MemoryBackend", { enumerable: true, get: function () { return MemoryBackend_1.MemoryBackend; } });
var FileBackend_1 = require("./FileBackend");
Object.defineProperty(exports, "FileBackend", { enumerable: true, get: function () { return FileBackend_1.FileBackend; } });
var PostgresBackend_1 = require("./PostgresBackend");
Object.defineProperty(exports, "PostgresBackend", { enumerable: true, get: function () { return PostgresBackend_1.PostgresBackend; } });
var SupabaseBackend_1 = require("./SupabaseBackend");
Object.defineProperty(exports, "SupabaseBackend", { enumerable: true, get: function () { return SupabaseBackend_1.SupabaseBackend; } });
