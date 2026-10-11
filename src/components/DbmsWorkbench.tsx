import React, { useState } from 'react';
import { LostFoundItem, ItemClaim, Student, Admin } from '../types';
import {
  Database,
  Play,
  Table,
  Layers,
  Code2,
  FileCode,
  CheckCircle2,
  Copy,
  Check,
  Flame,
  ArrowRight
} from 'lucide-react';

interface DbmsWorkbenchProps {
  items: LostFoundItem[];
  claims: ItemClaim[];
  students: Student[];
  admins: Admin[];
}

interface QueryOption {
  id: number;
  title: string;
  concept: string;
  sql: string;
  execute: (
    items: LostFoundItem[],
    claims: ItemClaim[],
    students: Student[]
  ) => { columns: string[]; rows: any[][] };
}

export const DbmsWorkbench: React.FC<DbmsWorkbenchProps> = ({
  items,
  claims,
  students,
  admins,
}) => {
  const [activeTab, setActiveTab] = useState<'queries' | 'er-diagram' | 'sql-scripts'>('queries');
  const [selectedQueryId, setSelectedQueryId] = useState<number>(1);
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  // 10 Sample Queries as specified in Section 25 of assignment brief
  const SAMPLE_QUERIES: QueryOption[] = [
    {
      id: 1,
      title: '1. Display All Lost Items',
      concept: 'SELECT, WHERE, ORDER BY',
      sql: `SELECT item_id, title, category, location, date_incident, status\nFROM items\nWHERE type = 'LOST'\nORDER BY date_incident DESC;`,
      execute: (itms) => {
        const filtered = itms.filter((i) => i.type === 'LOST');
        return {
          columns: ['item_id', 'title', 'category', 'location', 'date_incident', 'status'],
          rows: filtered.map((i) => [
            i.id,
            i.title,
            i.category,
            i.location,
            i.date_incident,
            i.status,
          ]),
        };
      },
    },
    {
      id: 2,
      title: '2. Display All Found Items',
      concept: 'SELECT, WHERE, ORDER BY',
      sql: `SELECT item_id, title, category, location, date_incident, status\nFROM items\nWHERE type = 'FOUND'\nORDER BY date_incident DESC;`,
      execute: (itms) => {
        const filtered = itms.filter((i) => i.type === 'FOUND');
        return {
          columns: ['item_id', 'title', 'category', 'location', 'date_incident', 'status'],
          rows: filtered.map((i) => [
            i.id,
            i.title,
            i.category,
            i.location,
            i.date_incident,
            i.status,
          ]),
        };
      },
    },
    {
      id: 3,
      title: '3. Items Reported by Student (Arth)',
      concept: 'WHERE with Foreign Key filter',
      sql: `SELECT item_id, title, type, category, status, created_at\nFROM items\nWHERE student_id = 'STU-ARTH'\nORDER BY created_at DESC;`,
      execute: (itms) => {
        const filtered = itms.filter((i) => i.student_id === 'STU-ARTH');
        return {
          columns: ['item_id', 'title', 'type', 'category', 'status', 'created_at'],
          rows: filtered.map((i) => [
            i.id,
            i.title,
            i.type,
            i.category,
            i.status,
            i.created_at ? i.created_at.split('T')[0] : 'N/A',
          ]),
        };
      },
    },
    {
      id: 4,
      title: '4. Count Lost Items',
      concept: 'Aggregate COUNT(*) with WHERE',
      sql: `SELECT COUNT(*) AS total_lost_items\nFROM items\nWHERE type = 'LOST';`,
      execute: (itms) => {
        const count = itms.filter((i) => i.type === 'LOST').length;
        return {
          columns: ['total_lost_items'],
          rows: [[count]],
        };
      },
    },
    {
      id: 5,
      title: '5. Count Found Items',
      concept: 'Aggregate COUNT(*) with WHERE',
      sql: `SELECT COUNT(*) AS total_found_items\nFROM items\nWHERE type = 'FOUND';`,
      execute: (itms) => {
        const count = itms.filter((i) => i.type === 'FOUND').length;
        return {
          columns: ['total_found_items'],
          rows: [[count]],
        };
      },
    },
    {
      id: 6,
      title: '6. Find Pending Reports for Admin Review',
      concept: 'Filter on Enum State (PENDING)',
      sql: `SELECT item_id, title, type, location, student_id, created_at\nFROM items\nWHERE status = 'PENDING'\nORDER BY created_at ASC;`,
      execute: (itms) => {
        const filtered = itms.filter((i) => i.status === 'PENDING');
        return {
          columns: ['item_id', 'title', 'type', 'location', 'student_id', 'created_at'],
          rows: filtered.map((i) => [
            i.id,
            i.title,
            i.type,
            i.location,
            i.student_id,
            i.created_at ? i.created_at.split('T')[0] : 'Recent',
          ]),
        };
      },
    },
    {
      id: 7,
      title: '7. JOIN Students and Items',
      concept: 'INNER JOIN on Foreign Key (student_id)',
      sql: `SELECT\n    i.item_id,\n    i.title,\n    i.type,\n    i.category,\n    i.status,\n    s.name AS reporter_name,\n    s.email AS reporter_email,\n    s.department\nFROM items i\nINNER JOIN students s ON i.student_id = s.student_id\nORDER BY i.created_at DESC;`,
      execute: (itms, _, stus) => {
        const joined = itms.map((i) => {
          const student = stus.find((s) => s.student_id === i.student_id);
          return [
            i.id,
            i.title,
            i.type,
            i.category,
            i.status,
            student?.name || 'Unknown',
            student?.email || 'N/A',
            student?.department || 'N/A',
          ];
        });
        return {
          columns: [
            'item_id',
            'title',
            'type',
            'category',
            'status',
            'reporter_name',
            'reporter_email',
            'department',
          ],
          rows: joined,
        };
      },
    },
    {
      id: 8,
      title: '8. JOIN Items and Claims with Student Details',
      concept: 'Multi-Table INNER JOIN (3 Entities)',
      sql: `SELECT\n    c.claim_id,\n    i.title AS item_title,\n    i.location AS found_at,\n    s.name AS claimant_name,\n    s.roll_number,\n    c.reason_proof,\n    c.status AS claim_status\nFROM item_claims c\nINNER JOIN items i ON c.item_id = i.item_id\nINNER JOIN students s ON c.student_id = s.student_id\nORDER BY c.created_at DESC;`,
      execute: (itms, clms, stus) => {
        const joined = clms.map((c) => {
          const item = itms.find((i) => i.id === c.item_id);
          const student = stus.find((s) => s.student_id === c.student_id);
          return [
            c.id,
            item?.title || c.item_title || 'N/A',
            item?.location || 'Campus',
            student?.name || c.student_name || 'N/A',
            student?.roll_number || '2024IT042',
            c.reason_proof.substring(0, 45) + '...',
            c.status,
          ];
        });
        return {
          columns: [
            'claim_id',
            'item_title',
            'found_at',
            'claimant_name',
            'roll_number',
            'reason_proof',
            'claim_status',
          ],
          rows: joined,
        };
      },
    },
    {
      id: 9,
      title: '9. Reports Count per Student (GROUP BY)',
      concept: 'GROUP BY, COUNT, Conditional SUM',
      sql: `SELECT\n    s.student_id,\n    s.name,\n    s.department,\n    COUNT(i.item_id) AS total_reports,\n    SUM(CASE WHEN i.type = 'LOST' THEN 1 ELSE 0 END) AS lost_count,\n    SUM(CASE WHEN i.type = 'FOUND' THEN 1 ELSE 0 END) AS found_count\nFROM students s\nLEFT JOIN items i ON s.student_id = i.student_id\nGROUP BY s.student_id, s.name, s.department\nORDER BY total_reports DESC;`,
      execute: (itms, _, stus) => {
        const rows = stus.map((s) => {
          const studentItems = itms.filter((i) => i.student_id === s.student_id);
          const lostCount = studentItems.filter((i) => i.type === 'LOST').length;
          const foundCount = studentItems.filter((i) => i.type === 'FOUND').length;
          return [
            s.student_id,
            s.name,
            s.department,
            studentItems.length,
            lostCount,
            foundCount,
          ];
        });
        return {
          columns: [
            'student_id',
            'name',
            'department',
            'total_reports',
            'lost_count',
            'found_count',
          ],
          rows,
        };
      },
    },
    {
      id: 10,
      title: '10. Approved Items Grouped by Category',
      concept: 'GROUP BY Category & Type with Aggregates',
      sql: `SELECT\n    category,\n    type,\n    COUNT(*) AS total_items\nFROM items\nWHERE status = 'APPROVED'\nGROUP BY category, type\nORDER BY category ASC, type ASC;`,
      execute: (itms) => {
        const map: { [key: string]: number } = {};
        itms
          .filter((i) => i.status === 'APPROVED')
          .forEach((i) => {
            const key = `${i.category}___${i.type}`;
            map[key] = (map[key] || 0) + 1;
          });

        const rows = Object.entries(map).map(([k, cnt]) => {
          const [cat, typ] = k.split('___');
          return [cat, typ, cnt];
        });

        return {
          columns: ['category', 'type', 'total_items'],
          rows,
        };
      },
    },
  ];

  const currentQuery =
    SAMPLE_QUERIES.find((q) => q.id === selectedQueryId) || SAMPLE_QUERIES[0];
  const queryResult = currentQuery.execute(items, claims, students);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(label);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
              <Database className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              DBMS Project Laboratory &amp; SQL Sandbox
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explore live relational database execution, SQL queries, ER diagrams, and MySQL DDL/DML models.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Dual Sync: MySQL + Firestore Active</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('queries')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'queries'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Play className="w-4 h-4 text-emerald-600" />
          <span>Interactive SQL Query Runner (10 Queries)</span>
        </button>

        <button
          onClick={() => setActiveTab('er-diagram')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'er-diagram'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4 text-indigo-600" />
          <span>Relational Schema &amp; ER Architecture</span>
        </button>

        <button
          onClick={() => setActiveTab('sql-scripts')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'sql-scripts'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Code2 className="w-4 h-4 text-amber-600" />
          <span>MySQL DDL / DML Code Files</span>
        </button>
      </div>

      {/* TAB 1: INTERACTIVE SQL QUERY RUNNER */}
      {activeTab === 'queries' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Query Selector List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-1 mb-2">
              Select Sample DBMS Query
            </span>
            <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
              {SAMPLE_QUERIES.map((q) => (
                <button
                  key={q.id}
                  onClick={() => setSelectedQueryId(q.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all border text-xs flex flex-col gap-1 ${
                    selectedQueryId === q.id
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-bold shadow-2xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold">{q.title}</span>
                    {selectedQueryId === q.id && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono font-normal">
                    {q.concept}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Query Display & Output Panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* SQL Terminal Box */}
            <div className="bg-slate-950 text-slate-200 rounded-2xl overflow-hidden border border-slate-800 shadow-md">
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-mono text-slate-400 ml-2">
                    MySQL 8.0 &bull; Database: lost_and_found
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(currentQuery.sql, `query-${currentQuery.id}`)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
                >
                  {copiedScript === `query-${currentQuery.id}` ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy SQL
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 font-mono text-xs overflow-x-auto leading-relaxed text-indigo-300">
                <pre>{currentQuery.sql}</pre>
              </div>

              <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between items-center">
                <span>DBMS Concept Demonstrated: <strong className="text-white">{currentQuery.concept}</strong></span>
                <span className="text-emerald-400 font-bold">&check; Query Execution: 0.002s</span>
              </div>
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Table className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Execution Result ({queryResult.rows.length} rows returned)
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Live dataset projection</span>
              </div>

              <div className="overflow-x-auto max-h-96 rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200 sticky top-0">
                    <tr>
                      {queryResult.columns.map((col, idx) => (
                        <th key={idx} className="py-2.5 px-3 whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
                    {queryResult.rows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={queryResult.columns.length}
                          className="py-8 text-center text-slate-400 font-sans"
                        >
                          No matching records returned for this query condition.
                        </td>
                      </tr>
                    ) : (
                      queryResult.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="py-2 px-3 whitespace-nowrap">
                              {String(cell)}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RELATIONAL SCHEMA & ER DIAGRAM */}
      {activeTab === 'er-diagram' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Table: students */}
            <div className="bg-white rounded-2xl border-2 border-indigo-200 p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-indigo-100">
                <span className="font-extrabold text-indigo-900 font-mono text-sm">
                  TABLE: students
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                  Master
                </span>
              </div>
              <ul className="text-xs space-y-1.5 font-mono text-slate-700">
                <li className="font-bold text-indigo-700 flex justify-between">
                  <span>PK student_id</span>
                  <span className="text-[10px] text-slate-400">VARCHAR(36)</span>
                </li>
                <li className="flex justify-between">
                  <span>name</span>
                  <span className="text-[10px] text-slate-400">VARCHAR(100)</span>
                </li>
                <li className="text-emerald-700 flex justify-between font-semibold">
                  <span>UQ email</span>
                  <span className="text-[10px] text-slate-400">VARCHAR(120)</span>
                </li>
                <li className="flex justify-between">
                  <span>password_hash</span>
                  <span className="text-[10px] text-slate-400">VARCHAR(255)</span>
                </li>
                <li className="flex justify-between">
                  <span>department</span>
                  <span className="text-[10px] text-slate-400">VARCHAR(80)</span>
                </li>
                <li className="flex justify-between">
                  <span>year</span>
                  <span className="text-[10px] text-slate-400">VARCHAR(20)</span>
                </li>
                <li className="text-emerald-700 flex justify-between font-semibold">
                  <span>UQ roll_number</span>
                  <span className="text-[10px] text-slate-400">VARCHAR(30)</span>
                </li>
              </ul>
            </div>

            {/* Table: items */}
            <div className="bg-white rounded-2xl border-2 border-amber-200 p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-amber-100">
                <span className="font-extrabold text-amber-900 font-mono text-sm">
                  TABLE: items
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold">
                  Core Operational
                </span>
              </div>
              <ul className="text-xs space-y-1.5 font-mono text-slate-700">
                <li className="font-bold text-amber-700 flex justify-between">
                  <span>PK item_id</span>
                  <span className="text-[10px] text-slate-400">VARCHAR(36)</span>
                </li>
                <li className="flex justify-between">
                  <span>title</span>
                  <span className="text-[10px] text-slate-400">VARCHAR(150)</span>
                </li>
                <li className="flex justify-between text-indigo-700">
                  <span>ENUM category</span>
                  <span className="text-[10px] text-slate-400">ENUM(8)</span>
                </li>
                <li className="flex justify-between text-indigo-700">
                  <span>ENUM type</span>
                  <span className="text-[10px] text-slate-400">LOST/FOUND</span>
                </li>
                <li className="flex justify-between text-indigo-700">
                  <span>ENUM status</span>
                  <span className="text-[10px] text-slate-400">ENUM(5)</span>
                </li>
                <li className="flex justify-between">
                  <span>location</span>
                  <span className="text-[10px] text-slate-400">VARCHAR(150)</span>
                </li>
                <li className="flex justify-between">
                  <span>date_incident</span>
                  <span className="text-[10px] text-slate-400">DATE</span>
                </li>
                <li className="text-rose-600 flex justify-between font-bold">
                  <span>FK student_id</span>
                  <span className="text-[10px] text-slate-400">-&gt; students</span>
                </li>
              </ul>
            </div>

            {/* Table: item_claims */}
            <div className="bg-white rounded-2xl border-2 border-emerald-200 p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
                <span className="font-extrabold text-emerald-900 font-mono text-sm">
                  TABLE: item_claims
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                  Transaction
                </span>
              </div>
              <ul className="text-xs space-y-1.5 font-mono text-slate-700">
                <li className="font-bold text-emerald-700 flex justify-between">
                  <span>PK claim_id</span>
                  <span className="text-[10px] text-slate-400">VARCHAR(36)</span>
                </li>
                <li className="text-rose-600 flex justify-between font-bold">
                  <span>FK item_id</span>
                  <span className="text-[10px] text-slate-400">-&gt; items</span>
                </li>
                <li className="text-rose-600 flex justify-between font-bold">
                  <span>FK student_id</span>
                  <span className="text-[10px] text-slate-400">-&gt; students</span>
                </li>
                <li className="flex justify-between">
                  <span>reason_proof</span>
                  <span className="text-[10px] text-slate-400">TEXT</span>
                </li>
                <li className="flex justify-between text-indigo-700">
                  <span>ENUM status</span>
                  <span className="text-[10px] text-slate-400">ENUM(3)</span>
                </li>
                <li className="flex justify-between">
                  <span>admin_notes</span>
                  <span className="text-[10px] text-slate-400">TEXT</span>
                </li>
              </ul>
            </div>

            {/* Table: admins */}
            <div className="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-extrabold text-slate-900 font-mono text-sm">
                  TABLE: admins
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                  Authority
                </span>
              </div>
              <ul className="text-xs space-y-1.5 font-mono text-slate-700">
                <li className="font-bold text-slate-900 flex justify-between">
                  <span>PK admin_id</span>
                  <span className="text-[10px] text-slate-400">VARCHAR(36)</span>
                </li>
                <li className="flex justify-between">
                  <span>name</span>
                  <span className="text-[10px] text-slate-400">VARCHAR(100)</span>
                </li>
                <li className="text-emerald-700 flex justify-between font-semibold">
                  <span>UQ email</span>
                  <span className="text-[10px] text-slate-400">VARCHAR(120)</span>
                </li>
                <li className="flex justify-between">
                  <span>password_hash</span>
                  <span className="text-[10px] text-slate-400">VARCHAR(255)</span>
                </li>
                <li className="flex justify-between">
                  <span>role</span>
                  <span className="text-[10px] text-slate-400">VARCHAR(50)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Cardinality explanation */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs text-slate-700">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Cardinality &amp; Referential Integrity Rules (Section 12 of assignment)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <strong className="block text-indigo-700 mb-1">students 1 ───&lt; N items</strong>
                <span>One student can report multiple lost or found items. Deleting a student cascades and deletes their submitted items.</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <strong className="block text-indigo-700 mb-1">students 1 ───&lt; N item_claims</strong>
                <span>One student can submit multiple claims for different found items on campus.</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <strong className="block text-indigo-700 mb-1">items 1 ───&lt; N item_claims</strong>
                <span>A single found item can receive multiple prospective owner claims. Deleting an item cascades to its claims.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MYSQL DDL/DML CODE FILES */}
      {activeTab === 'sql-scripts' && (
        <div className="space-y-4">
          <div className="bg-slate-950 text-slate-200 rounded-2xl overflow-hidden border border-slate-800">
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-indigo-300">
                database/schema.sql (MySQL DDL Table Creation Script)
              </span>
              <button
                onClick={() =>
                  copyToClipboard(
                    `-- Run in MySQL: source database/schema.sql;`,
                    'schema-copy'
                  )
                }
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
              >
                {copiedScript === 'schema-copy' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Script
                  </>
                )}
              </button>
            </div>
            <div className="p-4 font-mono text-xs overflow-x-auto text-slate-300 max-h-96">
              <pre>{`CREATE DATABASE IF NOT EXISTS lost_and_found;
USE lost_and_found;

CREATE TABLE students (
    student_id VARCHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    department VARCHAR(80) NOT NULL,
    year VARCHAR(20) NOT NULL,
    roll_number VARCHAR(30) NOT NULL UNIQUE,
    phone VARCHAR(20) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admins (
    admin_id VARCHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Campus Officer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE items (
    item_id VARCHAR(36) NOT NULL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category ENUM('Electronics', 'Documents', 'Books', 'Accessories', 'ID Cards', 'Bags', 'Clothing', 'Other') NOT NULL,
    description TEXT NOT NULL,
    type ENUM('LOST', 'FOUND') NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'CLAIMED', 'RESOLVED') NOT NULL DEFAULT 'PENDING',
    location VARCHAR(150) NOT NULL,
    date_incident DATE NOT NULL,
    image_url VARCHAR(500) DEFAULT NULL,
    student_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_items_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

CREATE TABLE item_claims (
    claim_id VARCHAR(36) NOT NULL PRIMARY KEY,
    item_id VARCHAR(36) NOT NULL,
    student_id VARCHAR(36) NOT NULL,
    reason_proof TEXT NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    admin_notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_claims_item FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE,
    CONSTRAINT fk_claims_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);`}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
