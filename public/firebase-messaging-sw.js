/* eslint-disable no-undef */
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyDFvl6woThzuoO3LfRwKwSZI1Jo-cSgpro",
  authDomain: "taskify-29c1e.firebaseapp.com",
  projectId: "taskify-29c1e",
  storageBucket: "taskify-29c1e.firebasestorage.app",
  messagingSenderId: "1082658905159",
  appId: "1:1082658905159:web:5ba0858411db7f1e55e562",
  measurementId: "G-GHYVX8GECF",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
