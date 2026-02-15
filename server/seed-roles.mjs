#!/usr/bin/env node
/**
 * Seed script to initialize default roles and permissions
 * Run with: node seed-roles.mjs
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

// Parse MySQL connection string
function parseConnectionString(url) {
  const regex = /mysql:\/\/([^:]+):([^@]+)@([^/]+)\/(.+)/;
  const match = url.match(regex);
  
  if (!match) {
    throw new Error('Invalid DATABASE_URL format');
  }
  
  return {
    user: match[1],
    password: match[2],
    host: match[3],
    database: match[4],
  };
}

async function seedRolesAndPermissions() {
  let connection;
  
  try {
    const config = parseConnectionString(DATABASE_URL);
    connection = await mysql.createConnection(config);
    
    console.log('✓ Connected to database');
    
    // Define permissions
    const permissions = [
      { permissionId: 'view_dashboard', name: 'View Dashboard', description: 'View the main dashboard', category: 'view' },
      { permissionId: 'view_data', name: 'View Data', description: 'View institutional performance data', category: 'view' },
      { permissionId: 'export_reports', name: 'Export Reports', description: 'Export data to Excel and PDF', category: 'export' },
      { permissionId: 'submit_data', name: 'Submit Data', description: 'Submit monthly performance data', category: 'edit' },
      { permissionId: 'manage_users', name: 'Manage Users', description: 'Create, edit, and delete users', category: 'admin' },
      { permissionId: 'manage_roles', name: 'Manage Roles', description: 'Create, edit, and delete roles', category: 'admin' },
      { permissionId: 'view_audit_log', name: 'View Audit Log', description: 'View system audit trail', category: 'view' },
    ];
    
    // Insert permissions
    console.log('\nInserting permissions...');
    for (const perm of permissions) {
      try {
        await connection.execute(
          'INSERT IGNORE INTO permissions (permissionId, name, description, category) VALUES (?, ?, ?, ?)',
          [perm.permissionId, perm.name, perm.description, perm.category]
        );
        console.log(`  ✓ ${perm.name}`);
      } catch (error) {
        console.log(`  - ${perm.name} (already exists)`);
      }
    }
    
    // Get permission IDs
    const [permRows] = await connection.execute('SELECT id, permissionId FROM permissions');
    const permMap = new Map(permRows.map(row => [row.permissionId, row.id]));
    
    // Define default roles
    const defaultRoles = [
      {
        name: 'Executive',
        description: 'Executive leadership with full system access',
        permissions: ['view_dashboard', 'view_data', 'export_reports', 'manage_users', 'manage_roles', 'view_audit_log'],
      },
      {
        name: 'Institution Lead',
        description: 'Lead for a specific institution',
        permissions: ['view_dashboard', 'view_data', 'export_reports', 'submit_data'],
      },
      {
        name: 'Data Analyst',
        description: 'Analyst with data viewing and export capabilities',
        permissions: ['view_dashboard', 'view_data', 'export_reports'],
      },
      {
        name: 'Viewer',
        description: 'Read-only access to dashboard and reports',
        permissions: ['view_dashboard'],
      },
    ];
    
    // Insert roles
    console.log('\nInserting roles...');
    for (const roleData of defaultRoles) {
      try {
        const result = await connection.execute(
          'INSERT IGNORE INTO roles (name, description) VALUES (?, ?)',
          [roleData.name, roleData.description]
        );
        
        // Get the role ID
        const [roleRows] = await connection.execute(
          'SELECT id FROM roles WHERE name = ?',
          [roleData.name]
        );
        
        if (roleRows.length > 0) {
          const roleId = roleRows[0].id;
          
          // Assign permissions
          for (const permId of roleData.permissions) {
            const permDbId = permMap.get(permId);
            if (permDbId) {
              try {
                await connection.execute(
                  'INSERT IGNORE INTO rolePermissions (roleId, permissionId) VALUES (?, ?)',
                  [roleId, permDbId]
                );
              } catch (error) {
                // Permission already assigned
              }
            }
          }
        }
        
        console.log(`  ✓ ${roleData.name}`);
      } catch (error) {
        console.log(`  - ${roleData.name} (already exists)`);
      }
    }
    
    console.log('\n✅ Seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the seeding
seedRolesAndPermissions();
