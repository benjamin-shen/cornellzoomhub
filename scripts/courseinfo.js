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

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}   

// const fileData = {};
// fileData.courses = [];

const populateCourseInfo = async () => {
  const res = await fetch(`${base}/config/subjects.json?roster=FA20`);
  const json = await res.json();
  const subjects = json.data.subjects.map(sub => sub.value);
  const fileData = {};
  fileData.courses = [];
  await subjects.forEach(async sub => {
      const res = await fetch(`${base}/search/classes.json?roster=FA20&subject=${sub}`);
      const courses = await res.json();
      const subData = courses.data.classes.map(course => {
        return {
          subject: sub,
          number: course.catalogNbr,
          sections: course.enrollGroups[0].classSections.map(section => {
            return {
              number: section.classNbr,
              instructors: section.meetings.length > 0 ? section.meetings[0].instructors.map(ins => ins.firstName + " " + ins.middleName + " " + ins.lastName) : [], 
              netids: section.meetings.length > 0 ? section.meetings[0].instructors.map(ins => ins.netid) : []
            }
          }) 
        }
      })
      fileData.courses = fileData.courses.concat(subData);
      fs.writeFileSync('./classes.json', JSON.stringify(fileData));
  })

  subjects.forEach(async sub => {
    const collection = db.collection('courses');
    const res = await fetch(`${base}/search/classes.json?roster=FA20&subject=${sub}`);
    const courses = await res.json();
    await courses.data.classes.forEach(async course => {
      await course.enrollGroups[0].classSections.forEach(async section => {
        const subDoc = collection.doc(sub);
        await subDoc.set({});
        const courseNumberCollection = subDoc.collection("" + course.catalogNbr + "");
        await courseNumberCollection.doc('default').set({netids: [], link: ""})
        const sectionDoc = courseNumberCollection.doc("" + section.classNbr + "");
        await sectionDoc.set({
          instructors: section.meetings.length > 0 ? section.meetings[0].instructors.map(ins => ins.firstName + " " + ins.middleName + " " + ins.lastName) : [], 
          netids: section.meetings.length > 0 ? section.meetings[0].instructors.map(ins => ins.netid) : []
        });
        await sleep(1000);
      })
    })
  })
  return fileData;
}

populateCourseInfo().then((res) => console.log(res));