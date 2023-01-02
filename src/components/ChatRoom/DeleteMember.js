import { AppContext } from "../../Context/AppProvider";
import { useContext, useEffect } from "react";
import { db } from "../../firebase/configure";

const HandleDeleteMember = ({ uid }) => {
  const { setIsLoading, isLoading } = useContext(AppContext);
  setIsLoading(true);
  const selectedRoomId = sessionStorage.getItem("roomId");
  const currentRoomId = sessionStorage.getItem("roomId");
  const docRef = db.collection("rooms").doc(currentRoomId);
  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log("Document data:", doc.data().members);
        const newListMembers = doc.data().members.filter((currentMember) => uid !== currentMember);
        console.log(newListMembers);
        const roomRef = db.collection("rooms").doc(selectedRoomId);
        roomRef.update({
          members: [...newListMembers],
        });
      } else {
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [isLoading, setIsLoading]);
};
export default HandleDeleteMember;
