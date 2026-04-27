import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../supabase";
import axios from "axios";
import Swal from "sweetalert2";

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userIp, setUserIp] = useState("");
  const [messageCount, setMessageCount] = useState(0);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }, 100);
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .order("created_at", { ascending: true });
    if (!error) {
      setMessages(data);
      scrollToBottom();
    }
  };

  useEffect(() => {
    fetchMessages();
    getUserIp();

    // Polling setiap 5 detik (menggantikan Realtime yang error)
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const getUserIp = async () => {
    try {
      const cachedIp = localStorage.getItem("userIp");
      if (cachedIp) {
        setUserIp(cachedIp);
        return;
      }
      const response = await axios.get("https://ipapi.co/json");
      const newUserIp = response.data.network;
      setUserIp(newUserIp);
      localStorage.setItem("userIp", newUserIp);
      localStorage.setItem("ipExpiration", (new Date().getTime() + 60 * 60 * 1000).toString());
    } catch (error) {
      console.error("Gagal mendapatkan IP:", error);
    }
  };

  const isIpBlocked = async () => {
    try {
      const { data } = await supabase.from("blacklist_ips").select("ip_address");
      return data?.some((row) => row.ip_address === userIp) || false;
    } catch {
      return false;
    }
  };

  const sendMessage = async () => {
    if (message.trim() === "") return;

    const isBlocked = await isIpBlocked();
    if (isBlocked) {
      Swal.fire({
        icon: "error",
        title: "Blocked",
        text: "You are blocked from sending messages.",
        customClass: { container: "sweet-alert-container" },
      });
      return;
    }

    const currentDateString = new Date().toDateString();
    const storedDate = localStorage.getItem("messageCountDate");
    let count = parseInt(localStorage.getItem(userIp)) || 0;

    if (storedDate !== currentDateString) {
      count = 0;
      localStorage.setItem("messageCountDate", currentDateString);
    }

    if (count >= 20) {
      Swal.fire({
        icon: "error",
        title: "Message limit exceeded",
        text: "You have reached your daily message limit.",
        customClass: { container: "sweet-alert-container" },
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    const senderImageURL = user?.user_metadata?.avatar_url || "/AnonimUser.png";
    const trimmedMessage = message.trim().substring(0, 60);

    const { error } = await supabase.from("chats").insert({
      message: trimmedMessage,
      sender_image: senderImageURL,
      user_ip: userIp,
    });

    if (error) {
      console.error("Gagal mengirim:", error);
      return;
    }

    localStorage.setItem(userIp, (count + 1).toString());
    setMessage("");
    fetchMessages();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="" id="ChatAnonim">
      <div className="text-center text-4xl font-semibold" id="Glow">
        Text Anonim
      </div>
      <div className="mt-5" id="KotakPesan" style={{ overflowY: "auto" }}>
        {messages.map((msg, index) => (
          <div key={msg.id || index} className="flex items-start text-sm py-[1%]">
            <img
              src={msg.sender_image || "/AnonimUser.png"}
              alt="User Profile"
              className="h-7 w-7 mr-2"
            />
            <div className="relative top-[0.30rem]">{msg.message}</div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div id="InputChat" className="flex items-center mt-5">
        <input
          className="bg-transparent flex-grow pr-4 w-4 placeholder:text-white placeholder:opacity-60"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ketik pesan Anda..."
          maxLength={60}
        />
        <button onClick={sendMessage} className="ml-2">
          <img src="/paper-plane.png" alt="" className="h-4 w-4 lg:h-6 lg:w-6" />
        </button>
      </div>
    </div>
  );
}

export default Chat;
      
