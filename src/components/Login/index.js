import React, { useEffect } from "react";
import { Row, Col, Typography, Button, Card, message } from "antd";
import firebase, { db } from "../../firebase/configure";
import { BsFacebook } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { addDocument, generateKeywords } from "../../firebase/service";

const fbProvider = new firebase.auth.FacebookAuthProvider();
const ggProvider = new firebase.auth.GoogleAuthProvider();
ggProvider.setCustomParameters({ prompt: "select_account" });
function Login() {
  const navigate = useNavigate();

  const handleFBLogin = async () => {
    const { additionalUserInfo, user } = await firebase.auth().signInWithPopup(fbProvider);
    if (additionalUserInfo?.isNewUser) {
      addDocument("users", {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
        providerId: additionalUserInfo.providerId,
        keywords: generateKeywords(user.displayName),
        mode: "LIGHT",
        friends: [],
        requests: [],
      });
    }
  };

  const handleGoogleLogin = async () => {
    const { additionalUserInfo, user } = await firebase.auth().signInWithPopup(ggProvider);
    if (additionalUserInfo?.isNewUser) {
      addDocument("users", {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
        providerId: additionalUserInfo.providerId,
        keywords: generateKeywords(user.displayName),
        mode: "LIGHT",
        friends: [],
        requests: [],
        listFriendsUid: [],
      });
    }
  };

  useEffect(() => {
    const unsubcribed = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (user?.additionalUserInfo?.isNewUser) {
          sessionStorage.setItem("user", JSON.stringify(user));
          message.success("Hello  " + user.displayName);
          navigate("/chat-room");
        } else {
          db.collection("users")
            .where("uid", "==", user?.uid)
            .orderBy("createAt")
            .get()
            .then((snapshot) => {
              snapshot.docs.map((doc) => {
                sessionStorage.setItem("user", JSON.stringify(doc.data()));
                return navigate("/chat-room");
              });
            });
        }
      } else {
        navigate("/login");
      }
    });

    //clean function
    return () => {
      unsubcribed();
    };
  }, [navigate]);

  return (
    <>
      <Card
        style={{
          width: 500,
          height: 600,
        }}
        className="mx-auto mt-28 shadow-lg shadow-black-500/50 bg-slate-50"
      >
        <Row justify="center" style={{ height: 800 }} className="mt-10">
          <Col span={20}>
            <Typography style={{ textAlign: "center" }} className="font-bold text-2xl mb-4">
              Login
            </Typography>
            <Button
              style={{ width: "100%", marginBottom: 7 }}
              className="flex justify-center"
              onClick={handleFBLogin}
              size="large"
            >
              <span className="mr-3">
                <BsFacebook className="text-sky-700" style={{ fontSize: "25px" }} />
              </span>
              <span className="font-semibold text-base">Login with Facebook</span>
            </Button>
            <Button style={{ width: "100%" }} size="large" className="flex justify-center" onClick={handleGoogleLogin}>
              <span className="mr-3" style={{ fontSize: "27px" }}>
                <FcGoogle />
              </span>
              <span className="font-semibold text-base">Login with Google</span>
            </Button>
          </Col>
        </Row>
      </Card>
    </>
  );
}

export default Login;
