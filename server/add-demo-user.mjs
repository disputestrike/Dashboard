import mysql from 'mysql2/promise';

async function addDemoUser() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'localhost',
      user: process.env.DATABASE_URL?.split('://')[1]?.split(':')[0] || 'root',
      password: process.env.DATABASE_URL?.split(':')[2]?.split('@')[0] || '',
      database: process.env.DATABASE_URL?.split('/').pop() || 'mcc_dashboard',
    });

    // Create a demo user with a generated openId
    const demoOpenId = `demo-john-${Date.now()}`;
    const now = new Date();
    
    const query = `
      INSERT INTO users (openId, email, name, loginMethod, role, createdAt, updatedAt, lastSignedIn)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        role = VALUES(role),
        updatedAt = VALUES(updatedAt),
        lastSignedIn = VALUES(lastSignedIn)
    `;

    await connection.execute(query, [
      demoOpenId,
      'John.Chawana@mcckc.edu',
      'John Chawana',
      'demo',
      'admin',
      now,
      now,
      now
    ]);

    console.log('✅ Demo user added successfully!');
    console.log(`Email: John.Chawana@mcckc.edu`);
    console.log(`Name: John Chawana`);
    console.log(`Role: Admin (Executive - Full Access)`);
    console.log(`OpenId: ${demoOpenId}`);
    console.log('\n📝 User can now sign in through the dashboard login page.');
    
    await connection.end();
    
  } catch (error) {
    console.error('Error adding demo user:', error.message);
    process.exit(1);
  }
}

addDemoUser();
