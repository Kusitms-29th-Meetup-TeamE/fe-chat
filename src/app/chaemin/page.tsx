"use client";

import { CompatClient, Stomp } from "@stomp/stompjs";
import { stringify } from "querystring";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";

export default function Chaemin() {
  const [connected, setConnected] = useState(false);
  const [groupId, setGroupId] = useState("");
  const [message, setMessage] = useState("");
  const [stompClient, setStompClient] = useState<CompatClient | null>(null);

  // 채팅 기록 데이터
  const [data, setData] = useState<any[]>([]);

  const roomID = 12;
  //    const token = JSON.stringify(window.localStorage.getItem("token")); // 현재 로그인 된 사용자의 토큰

  // 콜백함수 => ChatList 저장하기
  const callback = function (message: any) {
    if (message.body) {
      let msg = JSON.parse(message.body);
      setData((chats) => [...chats, msg]);
    }
  };

  const connect = () => {
    // 소켓 연결
    try {
      const socket = new SockJS("https://api.yeongjin.site/ws");
      const stompClient = Stomp.over(socket);
      stompClient.connect(
        {},
        () => {
          console.log("connection success");
          //   stompClient.subscribe(`/topic/group/${groupId}`, (res) => {
          //     const newMessage = JSON.parse(res.body).message;
          //     setData((prev) => [...prev, newMessage]);
          //   });
          stompClient.onConnect = function () {
            stompClient.subscribe(`/topic/group/${groupId}`, callback);
          };
        },
        () => {
          console.log("connection failed");
        }
      );
      setStompClient(stompClient);
      return () => {
        console.log("disconnect");
        stompClient.disconnect();
      };
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    connect();

    return () => stompClient?.disconnect();
  }, []);

  //   useEffect(() => {
  //     const socket = new SockJS("https://api.yeongjin.site/ws");
  //     const stompClient = Stomp.over(socket);
  //     stompClient.connect(
  //       {},
  //       () => {
  //         console.log("connection success");
  //         // stompClient.subscribe(`/topic/group/${groupId}`, (res) => {
  //         //   const newMessage = JSON.parse(res.body).message;
  //         //   setData((prev) => [...prev, newMessage]);
  //         // });
  //       },
  //       () => {
  //         console.log("connection failed");
  //       }
  //     );
  //     setStompClient(stompClient);
  //     return () => {
  //       console.log("disconnect");
  //       stompClient.disconnect();
  //     };
  //   }, []);

  const handleConnect = (event: any) => {
    event.preventDefault();
    setConnected(true);
  };

  const handleMessageSubmit = (event: any) => {
    event.preventDefault();
    const messageObject = {
      message: message,
    };
    if (stompClient !== null) {
      stompClient.send(
        `/app/group/${groupId}`,
        {},
        JSON.stringify(messageObject)
      );
      setMessage("");
    }
  };

  console.log("메세지 데이터", data);

  //  const msgBox = chatList.map((item, idx) => {
  //    if (Number(item.sender) !== userId) {
  //      return (
  //        <div key={idx} className={styles.otherchat}>
  //          <div className={styles.otherimg}>
  //            <img src={testImg} alt="" />
  //          </div>
  //          <div className={styles.othermsg}>
  //            <span>{item.data}</span>
  //          </div>
  //          <span className={styles.otherdate}>{item.date}</span>
  //        </div>
  //      );
  //    } else {
  //      return (
  //        <div key={idx} className={styles.mychat}>
  //          <div className={styles.mymsg}>
  //            <span>{item.data}</span>
  //          </div>
  //          <span className={styles.mydate}>{item.date}</span>
  //        </div>
  //      );
  //    }
  //  });

  return (
    <>
      {!connected ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (stompClient !== null) {
              stompClient.subscribe(`/topic/group/${groupId}`, (res) => {
                // console.log(`res:,`, res);
                // console.log(`받은 메시지: ${res.body}`);
                // console.log("type:", typeof res.body);
                const temp = JSON.parse(res.body).message;
                console.log("메세지:", temp);
              });
              setConnected(true);
            }
          }}
        >
          <input
            type="text"
            placeholder="websocket connect url"
            value={groupId}
            onChange={(event) => {
              setGroupId(event.target.value);
            }}
          />
          <input type="submit" value="connect" className="border-2" />
        </form>
      ) : (
        <div>
          <div>
            {data.map((item, index) => {
              console.log(data, "data");
              return <div key={index}>{item}</div>;
            })}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              const messageObject = {
                message: event.currentTarget.message.value,
              }; // 전송할 객체 생성
              //   console.log(messageObject.message);
              if (stompClient !== null) {
                stompClient.send(
                  `/app/group/${groupId}`,
                  {},
                  JSON.stringify(messageObject)
                );
                // setData(messageObject.message);
                setMessage("");
              }
            }}
          >
            <input
              type="text"
              placeholder="input message"
              name="message"
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
              }}
            />
            <input type="submit" value="send" className="border-2" />
          </form>
        </div>
      )}
    </>
  );
}
