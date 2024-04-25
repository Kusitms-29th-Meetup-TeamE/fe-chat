"use client";

import { Client, Stomp } from "@stomp/stompjs";
import axios from "axios";
import { useState } from "react";

interface Content {
  content: string;
  sender?: string;
}

export default function Test() {
  // 1. 채팅방 생성

  const [roomId, setRoomId] = useState<string>();

  // 채팅방 생성 api
  async function creatChatroom() {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/chat/rooms",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRoomId(response.data.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("에러 메시지:", error.response?.data?.errorMessage);
      } else {
        console.error(error);
      }
    }
  }

  // 2. 서버 연결
  const token = localStorage.getItem("accessToken");

  const [stompClient, setStompClient] = useState<Stomp | null>(null);

  const stomp = new Client({
    brokerURL: "ws://localhost:8080/chat",
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    debug: (str: string) => {
      console.log(str);
    },
    reconnectDelay: 5000, //자동 재 연결
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });
  setStompClient(stomp);

  stomp.activate(); // 클라이언트 활성화

  // 구독하기
  const [messages, setMessages] = useState<Content[]>([]);

  // stomp.onConnect = () => {
  //   console.log("WebSocket 연결이 열렸습니다.");
  //   const subscriptionDestination = isAdmin
  //     ? `/exchange/chat.exchange/room.${selectedRoomId}`
  //     : `/exchange/chat.exchange/room.${roomId}`;

  //   stomp.subscribe(subscriptionDestination, (frame) => {
  //     try {
  //       const parsedMessage = JSON.parse(frame.body);

  //       console.log(parsedMessage);
  //       setMessages((prevMessages) => [...prevMessages, parsedMessage]);
  //     } catch (error) {
  //       console.error("오류가 발생했습니다:", error);
  //     }
  //   });
  // };

  // const sendMessage = () => {
  //   // 메시지 전송
  //   if (stompClient && stompClient.connected) {
  //     const destination = isAdmin
  //       ? `/pub/chat.message.${selectedRoomId}`
  //       : `/pub/chat.message.${roomId}`;

  //     stompClient.publish({
  //       destination,
  //       body: JSON.stringify({
  //         content: inputMessage,
  //         sender: user,
  //       }),
  //     });
  //   }

  //   setInputMessage("");
  // };

  return <>hihi This page is Chat-page.</>;
}
