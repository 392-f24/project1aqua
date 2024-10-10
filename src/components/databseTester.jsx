import { ref, set } from 'firebase/database';
import { database } from './firebaseConfig';  // Import storage from your Firebase config file

function writeUserData(userId, name, email, age) {
    // Get a reference to the path where you want to store data
    const userRef = ref(database, 'test_users/' + userId);
  
    // Write the data to that reference
    set(userRef, {
      username: name,
      email: email,
      age: age
    })
    .then(() => {
      console.log("Data written successfully!");
    })
    .catch((error) => {
      console.error("Error writing data:", error);
    });
  }

const DatabaseTester = () => {
    return (
        <div>
            <button onClick={writeUserData("Anant-Aqua", "Anant", "anantpoddar@gmail.com", 20)}>Write User</button>  
        </div>
    );
};

export default DatabaseTester;