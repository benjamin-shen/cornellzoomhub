const fetch = require('node-fetch');
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const fs = require('fs');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cornell-zoom-hub.firebaseio.com"
});

const db = admin.firestore();

const base = 'https://classes.cornell.edu/api/2.0';

/* 
{
  professors: [
    {
      ad665: [
        {
          subject: 'CS',
          number: 2112
        },
      ]
    }
  ]
}
*/

const profCollection = db.collection('professors');

const populateProfInfo = async () => {
  const file = fs.readFileSync('./classes.json', 'utf-8')
  const classInfo = JSON.parse(file);
  const set = new Set();
  console.log(classInfo);
  classInfo.courses.forEach(course => {
    course.sections.forEach(section => {
      section.netids.forEach(netid => {
        set.add(netid);
      })
    })
  })
  const fileData = {};
  fileData.professors = [];
  Array.from(set).forEach(prof => {
    const allCourses = classInfo.courses.filter(course => course.sections.some(section => section.netids.includes(prof))).map(course => {return {subject: course.subject, number: course.number}});
    const json = {};
    json[prof] = allCourses;
    fileData.professors.push(json);
  })
  console.log(fileData);
  fs.writeFileSync('./professors.json', JSON.stringify(fileData));
  fileData.professors.forEach(async professor => {
    const netid = Object.keys(professor)[0];
    const netidDoc = profCollection.doc(netid);
    await netidDoc.set({});
    professor[netid].forEach(async course => {
      await netidDoc.collection('courses').doc(course.subject + course.number).set(course);
    })
  })
}

populateProfInfo();