    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
    import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
    import * as XLSX from "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js";
    import { saveAs } from "https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js";

    const firebaseConfig = {
      apiKey: "AIzaSyC3r97wNXS_Kgvr9jCOK9ZCu_8YQr8Ev0A",
      authDomain: "fir-project-81a06.firebaseapp.com",
      projectId: "fir-project-81a06",
      storageBucket: "fir-project-81a06.appspot.com",
      messagingSenderId: "592078165458",
      appId: "1:592078165458:web:4e7e491c2688e9e086e40b"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    document.addEventListener('DOMContentLoaded', () => {
      document.getElementById("submit").addEventListener('click', function(e) {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const phoneNumber = document.getElementById("number").value;
        const date = document.getElementById("date").value;

        set(ref(db, `users/${username}-${Date.now()}`), {
          username,
          email,
          phoneNumber,
          date
        })
        .then(() => {
          alert("Data saved successfully!");
        })
        .catch((error) => {
          alert("Error saving data: " + error.message);
        });
      });

      document.getElementById("download").addEventListener('click', function() {
        get(ref(db, 'users')).then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const worksheet = XLSX.utils.json_to_sheet(Object.values(data));
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
            const xlsxFile = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
            const blob = new Blob([s2ab(xlsxFile)], { type: "application/octet-stream" });
            saveAs(blob, "output.xlsx");
          } else {
            alert("No data available");
          }
        }).catch((error) => {
          alert("Error fetching data: " + error.message);
        });
      });
    });

    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF;
      }
      return buf; // Keep this return statement
    }