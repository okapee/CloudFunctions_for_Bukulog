const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();
const fcm = admin.messaging();

// Saves a message to the Firebase Realtime Database but sanitizes the text by removing swearwords.
exports.sendMessage = functions.https.onCall(async (data, context) => {
  const registerUserId = data.registerUser;
  const registerUserTokenRef = await db
    .collection("users")
    .doc(registerUserId)
    .get();
  const registerUserToken = registerUserTokenRef.data()["token"];

  const sender = data.displayName;
  const bookTitle = data.bookTitle;

  console.log(
    "registeredUserId: " +
      registerUserId +
      " registerUserToken: " +
      registerUserToken +
      " sender: " +
      sender +
      " bookTitle: " +
      bookTitle
  );

  const payload = {
    notification: {
      title: "ぶくれん！からの通知",
      body: `${sender} が ${bookTitle} を借りたいようです。`,
      // icon: "your-icon-url",
      // click_action: "FLUTTER_NOTIFICATION_CLICK", // required only for onResume or onLaunch callbacks
    },
  };

  return fcm.sendToDevice(registerUserToken, payload);
});
