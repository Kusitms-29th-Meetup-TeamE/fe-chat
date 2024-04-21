"use client";
import { Client, CompatClient, Stomp } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";

{
  /* 

24.04.21 기준 테스트 완료

*/
}

export default function Test2() {
  const [chat, setChat] = useState(""); // 입력된 chat을 받을 변수
  const [chatList, setChatList] = useState<any[]>([]); // 채팅 기록
  const [stompClient, setStompClient] = useState<CompatClient | null>(null);
  const chatroomId = 12;

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
      stompClient.subscribe("/topic/group/" + chatroomId, callback);
    };

    setStompClient(stompClient);

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);

  const callback = (message: any) => {
    if (message.body) {
      let msg = JSON.parse(message.body);
      setChatList((chats) => [...chats, msg]);
    }
  };

  const sendChat = () => {
    if (chat === "") {
      return;
    }

    const messageObject = {
      message: chat,
    };

    stompClient?.send(
      `/app/group/${chatroomId}`,
      {},
      JSON.stringify(messageObject)
    );

    setChat("");
  };

  const onChangeChat = (e: any) => {
    setChat(e.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
  };

  return (
    <>
      <div>
        {/* 채팅 리스트 */}
        <div className="flex flex-col gap-2">
          {chatList.map((item, idx) => (
            <div key={idx} className="inline-flex">
              <span className="bg-yellow-300 py-2 px-5 rounded-lg">
                {item.message}
              </span>
            </div>
          ))}
        </div>

        {/* 하단 입력폼 */}
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
