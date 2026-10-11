import React, { useState } from 'react';
import { FileText, Database, Compass, Code2, Copy, Check, Download } from 'lucide-react';

export const DocsView: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<'report' | 'database' | 'api' | 'design'>('report');
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
              <FileText className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Academic DBMS Course Documentation &amp; Project Report
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Department of Computer Science &bull; Indian Institute of Information Technology, Bhopal
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Documentation'}</span>
          </button>
        </div>
      </div>

      {/* Doc selector tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveDoc('report')}
          className={`pb-2.5 px-3.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeDoc === 'report'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Project Report (19 Sections)
        </button>
        <button
          onClick={() => setActiveDoc('database')}
          className={`pb-2.5 px-3.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeDoc === 'database'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Database Design &amp; 10 SQL Queries
        </button>
        <button
          onClick={() => setActiveDoc('api')}
          className={`pb-2.5 px-3.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeDoc === 'api'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          REST API Documentation
        </button>
        <button
          onClick={() => setActiveDoc('design')}
          className={`pb-2.5 px-3.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeDoc === 'design'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          UI / UX &amp; Workflow Architecture
        </button>
      </div>

      {/* Doc Content Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6 text-sm text-slate-700 leading-relaxed">
        {activeDoc === 'report' && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-black text-slate-900">
                1. Project Abstract &amp; System Overview
              </h2>
              <p className="mt-2 text-slate-600">
                The Campus Lost and Found DBMS platform is designed to streamline property retrieval across academic facilities, libraries, computer complexes, and residential hostels. Grounded in relational database management theory, the system enforces foreign-key referential integrity, unique candidate keys, and granular attribute-level states across reports and claims.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                  Course Metadata
                </span>
                <p className="text-xs">Course: Database Management Systems (CS304)</p>
                <p className="text-xs">Database Engine: MySQL 8.0 &bull; Cloud: Firebase Firestore</p>
                <p className="text-xs">Backend: Python 3.11, FastAPI &bull; Frontend: Modern HTML/CSS/JS</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                  Configured Demo Accounts
                </span>
                <p className="text-xs">Admin: <strong>Hariom</strong> (Chief Proctor &bull; hariom@iiitbhopal.ac.in)</p>
                <p className="text-xs">Student 1: <strong>Arth</strong> (CSE 3rd Year &bull; arth@iiitbhopal.ac.in)</p>
                <p className="text-xs">Student 2: <strong>Shivam</strong> (IT 2nd Year &bull; shivam@iiitbhopal.ac.in)</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">Key DBMS Principles Implemented</h3>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                <li><strong>Relational Normalization</strong>: Strict 3NF normalization eliminating repeating groups and transitive dependencies.</li>
                <li><strong>Referential Integrity</strong>: Cascading deletes (`ON DELETE CASCADE`) preventing orphan items or claims.</li>
                <li><strong>Entity Constraints</strong>: Candidate keys (`UNIQUE email, roll_number`), Domain constraints (`ENUM type, status, category`).</li>
                <li><strong>Indexing Strategy</strong>: B-Tree indexes on search keys, status filters, and foreign keys for high throughput.</li>
              </ul>
            </div>
          </div>
        )}

        {activeDoc === 'database' && (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-900">
              Relational Database Tables &amp; Field Constraints
            </h2>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="font-bold text-indigo-700 text-sm font-mono">1. Table: students</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Primary Key: <code>student_id</code> | Candidate Keys: <code>email</code>, <code>roll_number</code>
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="font-bold text-indigo-700 text-sm font-mono">2. Table: items</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Primary Key: <code>item_id</code> | Foreign Key: <code>student_id</code> references <code>students(student_id)</code> ON DELETE CASCADE
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="font-bold text-indigo-700 text-sm font-mono">3. Table: item_claims</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Primary Key: <code>claim_id</code> | Foreign Keys: <code>item_id</code> references <code>items(item_id)</code>, <code>student_id</code> references <code>students(student_id)</code>
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="font-bold text-indigo-700 text-sm font-mono">4. Table: admins</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Primary Key: <code>admin_id</code> | Unique Key: <code>email</code>
                </p>
              </div>
            </div>
          </div>
        )}

        {activeDoc === 'api' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900">FastAPI REST Endpoints</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 font-bold text-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">Method</th>
                    <th className="py-2.5 px-3">Path</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Auth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  <tr>
                    <td className="py-2 px-3 text-emerald-600 font-bold">POST</td>
                    <td className="py-2 px-3">/api/auth/student/login</td>
                    <td className="py-2 px-3 font-sans">Verify student credentials in MySQL</td>
                    <td className="py-2 px-3 text-slate-400">Public</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-emerald-600 font-bold">POST</td>
                    <td className="py-2 px-3">/api/auth/admin/login</td>
                    <td className="py-2 px-3 font-sans">Verify administrator credentials</td>
                    <td className="py-2 px-3 text-slate-400">Public</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-blue-600 font-bold">GET</td>
                    <td className="py-2 px-3">/api/items</td>
                    <td className="py-2 px-3 font-sans">Query items with type, category, status filters</td>
                    <td className="py-2 px-3 text-slate-400">Public</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-emerald-600 font-bold">POST</td>
                    <td className="py-2 px-3">/api/items</td>
                    <td className="py-2 px-3 font-sans">Report a new Lost or Found item</td>
                    <td className="py-2 px-3 text-indigo-600">Student</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-emerald-600 font-bold">POST</td>
                    <td className="py-2 px-3">/api/students/claims</td>
                    <td className="py-2 px-3 font-sans">Submit claim for found item</td>
                    <td className="py-2 px-3 text-indigo-600">Student</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-amber-600 font-bold">PUT</td>
                    <td className="py-2 px-3">/api/admin/items/{'{id}'}/approve</td>
                    <td className="py-2 px-3 font-sans">Approve report for public listing</td>
                    <td className="py-2 px-3 text-rose-600">Admin</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-amber-600 font-bold">PUT</td>
                    <td className="py-2 px-3">/api/admin/claims/{'{id}'}/approve</td>
                    <td className="py-2 px-3 font-sans">Approve claim and mark item CLAIMED</td>
                    <td className="py-2 px-3 text-rose-600">Admin</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeDoc === 'design' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900">Workflow &amp; State Transitions</h2>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <p><strong>Item Lifecycle</strong>:</p>
              <div className="font-mono bg-white p-2.5 rounded border border-slate-200 text-slate-800">
                PENDING &mdash;&gt; APPROVED &mdash;&gt; CLAIMED (on valid claim) &mdash;&gt; RESOLVED
              </div>
              <p className="text-slate-500 pt-2">
                All transitions are validated against the DBMS constraints and real-time cloud Firestore collections.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
