import { Client, Stomp } from "@stomp/stompjs";

export default function Test2() {
  // client 객체 생성
  const client = new Client({
    brokerURL: "ws://localhost:8080/chat",
    connectHeaders: {
      //   Authorization: `Bearer ${token}`,
    },
    debug: (str: string) => {
      console.log(str);
    },
    reconnectDelay: 5000, //자동 재 연결
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  // 실행함수 및 에러처리함수
  client.onConnect = function (frame) {};
  client.onStompError = function (frame) {
    console.log("error:" + frame.headers["message"]);
    console.log("details:" + frame.body);
  };

  // client 활성화시키기
  client.activate();

  // 다시 비활성화
  //   client.deactivate();

  // 메세지 보내기

  client.publish({
    destination: "/topic/general",
    body: "hello world",
    headers: { priority: "9" },
  });

  //   const subscript = client.subscribe("/queue/test", callback);

  return <>hi</>;
}
