import Database from 'better-sqlite3';
const db=new Database('waste_management.db');
const users=db.prepare("SELECT * FROM users").all();
const out=users.map(u=>{
    const count=db.prepare("SELECT COUNT(*) as c FROM scans WHERE user_id = ?").get(u.id).c;
    return `User ${u.id} (${u.email}): ${count} scans`;
});
require('fs').writeFileSync('db_check.txt',out.join('\n'));
