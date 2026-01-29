"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Image as ImageIcon,
  Megaphone,
  User,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCommunityMessages } from "@/hooks/useCommunityMessages";
import { useAuth } from "@/hooks/useAuth";
import Avatar from "../common/Avatar";
import Card from "../common/Card";
import Spinner from "../common/Spinner";
import { useToast } from "@/app/providers";

interface CommunityChatProps {
  communityId: string;
  isAdmin?: boolean;
}

export default function CommunityChat({
  communityId,
  isAdmin,
}: CommunityChatProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { messages, isLoading, sendMessage, deleteMessage, summarizeCommunity } =
    useCommunityMessages(communityId);
  const [newMessage, setNewMessage] = useState("");
  const [media, setMedia] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && media.length === 0) return;

    try {
      await sendMessage(newMessage, media, isAnnouncement);
      setNewMessage("");
      setMedia([]);
      setPreviews([]);
      setIsAnnouncement(false);
    } catch (error) {
      console.error("Failed to send:", error);
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await deleteMessage(messageId);
      showToast("Message deleted", "success");
    } catch (error) {
      showToast("Failed to delete message", "error");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setMedia((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="flex flex-col h-[600px] overflow-hidden rounded-[2rem] border-none shadow-premium bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-500 rounded-xl text-white">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-gray-900 dark:text-gray-100 tracking-tight">
              Community Hub
            </h3>
            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">
              Real-time collaboration
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              try {
                const res = await summarizeCommunity(50);
                alert(res.summary);
              } catch (err) {
                console.error("Summarize failed", err);
                alert("Failed to summarize messages");
              }
            }}
            className="px-3 py-1 rounded-xl text-sm bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            AI Summary
          </button>
          <button className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all">
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {isLoading && messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-4">
            <Spinner size="md" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Syncing encrypted messages...
            </span>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
            <Megaphone className="w-12 h-12 mb-4 text-gray-300" />
            <p className="font-bold text-gray-500">Welcome to the lounge.</p>
            <p className="text-xs">
              Messages are persistent and shared with all members.
            </p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <MessageItem
              key={msg._id}
              message={msg}
              isMe={msg.senderId._id === (user?.id || (user as any)?._id)}
              canModerate={isAdmin}
              onDelete={handleDelete}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-white/5">
        <AnimatePresence>
          {previews.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex gap-2 mb-4 overflow-x-auto pb-2"
            >
              {previews.map((url, i) => (
                <div key={i} className="relative shrink-0">
                  <img
                    src={url}
                    alt=""
                    className="w-16 h-16 rounded-xl object-cover border-2 border-primary-500"
                  />
                  <button
                    onClick={() => removeMedia(i)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSend} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder={
                isAnnouncement ? "Type announcement..." : "Type your message..."
              }
              className={`w-full bg-white dark:bg-gray-950 border-none rounded-2xl py-4 pl-4 pr-12 text-sm font-medium focus:ring-2 focus:ring-primary-500 transition-all ${
                isAnnouncement ? "bg-indigo-50 dark:bg-indigo-900/20" : ""
              }`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-2 p-2 bg-primary-500 text-white rounded-xl hover:scale-105 transition-transform shadow-lg shadow-primary-500/30"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-xl text-gray-400 hover:text-primary-500 transition-all"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setIsAnnouncement(!isAnnouncement)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    isAnnouncement
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                      : "bg-white dark:bg-gray-800 text-gray-400 hover:text-indigo-500"
                  }`}
                >
                  <Megaphone className="w-3 h-3" />
                  Announcement
                </button>
              )}
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {user?.username}
            </p>
          </div>
        </form>
        <input
          type="file"
          multiple
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,video/*"
        />
      </div>
    </Card>
  );
}

function MessageItem({ 
  message, 
  isMe, 
  canModerate, 
  onDelete 
}: { 
  message: any; 
  isMe: boolean; 
  canModerate?: boolean; 
  onDelete: (id: string) => void;
}) {
  const showDelete = isMe || canModerate;

  return (
    <div className={`flex items-start gap-4 ${isMe ? "flex-row-reverse" : ""} group`}>
      <Avatar
        src={message.senderId.avatar}
        alt={message.senderId.username}
        size="sm"
        className="mt-1"
      />
      <div
        className={`max-w-[80%] ${
          isMe ? "items-end" : "items-start"
        } flex flex-col`}
      >
        <div className="flex items-center gap-2 mb-1">
          {!isMe && (
            <span className="text-[10px] font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest">
              {message.senderId.username}
            </span>
          )}
          <span className="text-[9px] text-gray-400 font-bold uppercase">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {showDelete && (
            <button
              onClick={() => onDelete(message._id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-red-500"
              title="Delete message"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>

        <div
          className={`p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
            message.isAnnouncement
              ? "bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-lg shadow-indigo-500/20 w-full"
              : isMe
              ? "bg-primary-500 text-white rounded-tr-none"
              : "bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-white/5"
          }`}
        >
          {message.content}

          {message.media && message.media.length > 0 && (
            <div className="mt-3 grid grid-cols-1 gap-2">
              {message.media.map((item: any, i: number) => (
                <img
                  key={i}
                  src={item.url}
                  alt=""
                  className="rounded-xl w-full h-auto object-cover max-h-48"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
