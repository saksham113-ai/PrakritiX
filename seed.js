import Database from 'better-sqlite3';
const db=new Database('waste_management.db');
const users=db.prepare("SELECT id FROM users").all();
if(users.length===0){
    console.log("No users found to seed data for!");
    process.exit(1);
}
const mockItems=[
    {item_type:"Banana Peel",confidence:0.98,bin_type:"Degradable",days:14,weight:0.15},
    {item_type:"Plastic Bottle",confidence:0.95,bin_type:"Non-Degradable",days:0,weight:0.05},
    {item_type:"Cardboard Box",confidence:0.88,bin_type:"Degradable",days:60,weight:0.4},
    {item_type:"Soda Can",confidence:0.99,bin_type:"Metal",days:0,weight:0.02},
    {item_type:"Batteries",confidence:0.96,bin_type:"Hazardous",days:0,weight:0.3},
    {item_type:"Apple Core",confidence:0.92,bin_type:"Degradable",days:18,weight:0.08},
    {item_type:"Glass Jar",confidence:0.85,bin_type:"Non-Degradable",days:0,weight:0.25},
    {item_type:"Paper Bag",confidence:0.91,bin_type:"Degradable",days:30,weight:0.03},
    {item_type:"Tin Can",confidence:0.97,bin_type:"Metal",days:0,weight:0.06},
    {item_type:"Paint Can",confidence:0.89,bin_type:"Hazardous",days:0,weight:1.2},
    {item_type:"Coffee Grounds",confidence:0.94,bin_type:"Degradable",days:21,weight:0.1},
    {item_type:"Styrofoam Container",confidence:0.87,bin_type:"Non-Degradable",days:0,weight:0.04},
    {item_type:"Aluminum Foil",confidence:0.93,bin_type:"Metal",days:0,weight:0.01},
    {item_type:"Leftover Food",confidence:0.95,bin_type:"Degradable",days:10,weight:0.5},
    {item_type:"Plastic Wrap",confidence:0.82,bin_type:"Non-Degradable",days:0,weight:0.02},
];
const insertScan=db.prepare(`
  INSERT INTO scans (user_id, item_type, confidence, bin_type, created_at, days_to_decompose, weight_kg) 
  VALUES (?, ?, ?, ?, datetime('now', ?), ?, ?)
`);
let count=0;
for(const user of users){
    for(let i=0;i<mockItems.length;i++){
        const item=mockItems[i];
        const daysAgo=Math.floor(i/5)*-1;
        const timeOffset=`${daysAgo} days`;
        insertScan.run(
            user.id,
            item.item_type,
            item.confidence,
            item.bin_type,
            timeOffset,
            item.days,
            item.weight
        );
        count++;
    }
}
console.log(`Successfully added ${count} mock scans across ${users.length} user(s) spread over 3 days!`);
