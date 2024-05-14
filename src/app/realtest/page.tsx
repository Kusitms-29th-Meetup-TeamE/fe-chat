"use client";
import { Client, CompatClient, Stomp } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";

export default function Test2() {
  const [chat, setChat] = useState(""); // 입력된 chat을 받을 변수
  const [stompClient, setStompClient] = useState<CompatClient | null>(null);
  const chatroomId = 12;
  const myId = 5;

  const [chatEmoticon, setChatEmoticon] = useState("");
  const [chatList, setChatList] = useState<any[]>([]); // 채팅 기록

  //

  useEffect(() => {
    const socket = new SockJS("https://api.yeongjin.site/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect(
      {},
      () => {
        console.log("connection success");
      },
      () => {
        console.log("connection failed");
      }
    );

    stompClient.onConnect = () => {
      stompClient.subscribe(`/topic/chatting/${chatroomId}`, (res) => {
        // console.log("res.body", JSON.parse(res.body));
        // console.log("res", JSON.parse(res.body).chatMessageLog);
        const msgLog = JSON.parse(res.body).chatMessageLog;
        setChatList(msgLog);
      });

      // stompClient.subscribe(`/topic/chatting/${chatroomId}`, callback);
    };

    setStompClient(stompClient);

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [chatList]);

  console.log("stompclient", stompClient);

  const callback = (message: any) => {
    if (message.body) {
      let msg = JSON.parse(message.body);
      console.log("msg:", msg);
      // setChatList((chats) => [...chats, msg]);
      // setInitData(msg.chatMessageLog);
      // setInitData((prev) => {
      //   if (prev === null) {
      //     return [msg];
      //   } else {
      //     return [...prev, msg];
      //   }
      // });

      // setChatList((chats) => [...chats, msg]);

      // setChatList((chats) => {
      //   const temp = [...chats][0]?.chatMessageLog;
      //   console.log("temp", temp[0]?.chatMessageLog);
      //   return [...chats[0]?.chatMessageLog, msg];
      // });
    }
  };

  // const chatMsgLog = initData[0]?.chatMessageLog;
  // console.log("chatMsgLog", chatMsgLog);

  const sendChat = () => {
    if (chat === "") {
      return;
    }

    const messageObject = {
      senderId: myId,
      text: chat,
    };

    stompClient?.send(
      `/app/chatting/${chatroomId}/text`,
      {},
      JSON.stringify(messageObject)
    );

    console.log("object", messageObject);

    //

    setChat("");
  };

  const sendEmoticon = () => {
    if (chatEmoticon === "") {
      return;
    }

    const messageObject = {
      // message: chat,
      senderId: myId,
      emoticon: chatEmoticon,
    };

    stompClient?.send(
      `/app/chatting/${chatroomId}/emoticon`,
      {},
      JSON.stringify(messageObject)
    );

    setChatEmoticon("");
  };

  const onChangeChat = (e: any) => {
    setChat(e.target.value);
  };

  const onChangeEmoticon = (e: any) => {
    setChatEmoticon(e.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
  };

  console.log("chatlist", chatList);

  return (
    <>
      <div>
        {/* 채팅 리스트 */}
        <div className="flex flex-col gap-2 border rounded max-h-[700px] overflow-y-auto">
          {/* <div className="inline-flex">
            <span className="bg-yellow-200 py-2 px-5 rounded-lg">
              {tempData?.text}
            </span>
          </div> */}
          새로운 메세지들
          {/* 새로운 메시지 */}
          {chatList?.map((item: any, idx: number) => (
            <div key={idx} className="inline-flex">
              <span className="bg-yellow-300 py-2 px-5 rounded-lg">
                {item?.text}
              </span>
            </div>
          ))}
        </div>

        {/* 하단 입력폼 */}
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 mt-4">
            {/* <input
              type="text"
              id="emoticon"
              value={chatEmoticon}
              className="border rounded-md p-2 border-gray-500"
              placeholder="이모티콘"
              onChange={onChangeEmoticon}
              onKeyDown={(ev) => {
                if (ev.keyCode === 13) {
                  sendEmoticon();
                }
              }}
            />{" "} */}
            <input
              type="text"
              id="msg"
              value={chat}
              className="border rounded-md p-2 border-gray-500"
              placeholder="메시지 보내기"
              onChange={onChangeChat}
              onKeyDown={(ev) => {
                if (ev.keyCode === 13) {
                  sendChat();
                }
              }}
            />
            <button type="submit" className="bg-gray-300 p-2 px-5 rounded-lg">
              전송
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
