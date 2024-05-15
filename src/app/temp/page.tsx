"use client";
import { Client, CompatClient, Stomp } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";

export default function Test2() {
  const [chat, setChat] = useState("");
  const [stompClient, setStompClient] = useState<CompatClient | null>(null);
  const chatroomId = 12;
  const myId = 5;
  const [chatEmoticon, setChatEmoticon] = useState("");
  const [chatList, setChatList] = useState<any[]>([]);

  useEffect(() => {
    const initializeWebSocket = () => {
      const socket = new SockJS("https://api.yeongjin.site/ws");
      const stompClient = Stomp.over(socket);

      stompClient.connect(
        {},
        () => {
          console.log("connection success");
          subscribeToChatTopic(stompClient);
        },
        () => {
          console.log("connection failed");
        }
      );

      setStompClient(stompClient);
    };

    initializeWebSocket();

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []); // Empty dependency array ensures that this effect runs only once

  const subscribeToChatTopic = (stompClient: CompatClient) => {
    stompClient.subscribe(`/topic/chatting/${chatroomId}`, (res) => {
      const msgLog = JSON.parse(res.body).chatMessageLog;
      setChatList(msgLog);
    });
  };

  const callback = (message: any) => {
    if (message.body) {
      let msg = JSON.parse(message.body);
      setChatList((prevChatList) => [...prevChatList, msg]); // 새로운 메시지를 chatList에 추가
    }
  };

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

    stompClient?.subscribe(`/topic/chatting/${chatroomId}`, callback); // 새로운 메시지를 받을 때마다 callback 함수 실행

    setChat("");
  };

  const sendEmoticon = () => {
    if (chatEmoticon === "") {
      return;
    }

    const messageObject = {
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

  console.log("chatlist:", chatList);

  return (
    <>
      <div>
        <div className="flex flex-col gap-2 border rounded max-h-[700px] overflow-y-auto">
          새로운 메세지들
          {chatList?.map((item: any, idx: number) => (
            <div key={idx} className="inline-flex">
              <span className="bg-yellow-300 py-2 px-5 rounded-lg">
                {item?.text}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 mt-4">
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
