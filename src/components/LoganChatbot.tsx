
import React, { useState, useRef, useEffect } from "react";
import { X, SendHorizontal, Bot } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export const LoganChatbot: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hi, I'm Logan! I can help you with any questions about document eligibility or note buyer criteria. How can I assist you today?", isUser: false },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const messageText = inputValue.trim();
    
    // Add user message
    setMessages((prev) => [...prev, { text: messageText, isUser: true }]);
    
    // Clear input fields
    setInputValue("");
    
    // Show typing indicator
    setIsTyping(true);

    // API call to backend for bot response
    try {
      const response = await fetch("https://n8n-prod.onrender.com/webhook/loa-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: messageText })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      // Get the text response first
      const responseText = await response.text();
      
      // Try to parse it as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        console.log("Raw response:", responseText);
        
        // If it's not valid JSON but has content, treat the whole response as the output
        if (responseText && responseText.trim()) {
          data = { output: responseText };
        } else {
          throw new Error("Invalid response format");
        }
      }

      // Hide typing indicator and add bot response from API
      setIsTyping(false);
      setMessages((prev) => [...prev, { text: data.output, isUser: false }]);

    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, there was an error processing your request. Please try again later.", isUser: false }
      ]);
    }
  };

  // Helper function to render message content safely
  const renderMessageContent = (content: string) => {
    return <div className="text-sm formatted-html-content" dangerouslySetInnerHTML={{ __html: content }} />;
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 group">
        <div 
          className="relative flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300"
          onClick={() => setIsChatOpen(true)}
        >
          <div className="relative">
            <div className="absolute -top-10 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap shadow-md">
              Ask LOGAN for help
            </div>
            
            {/* Improved pulsating ring animation - hides when chat is open, colors match "analyze docs" */}
            {!isChatOpen && (
              <>
                <div className="absolute inset-0 rounded-full bg-[#8B5CF6]/20 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] shadow-[0_0_10px_rgba(139,92,246,0.3)]"></div>
                <div className="absolute inset-0 rounded-full bg-[#6E59A5]/10 animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite] shadow-[0_0_15px_rgba(110,89,165,0.4)]"></div>
              </>
            )}
            
            <img 
              src="/lovable-uploads/12d1eec6-25de-486a-9bb5-74c5d247d649.png" 
              alt="Logan Assistant" 
              className="h-24 w-24 rounded-full object-cover shadow-lg relative z-10"
              style={{ 
                objectPosition: "center top", 
                objectFit: "cover",
                filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.3))"
              }}
            />
            <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs animate-pulse shadow-md z-20">
              <Bot size={12} />
            </div>
          </div>
        </div>
      </div>

      {isChatOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-[420px] rounded-xl bg-white border border-gray-200 text-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] backdrop-blur-sm">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10 border-2 border-white/50 ring-2 ring-blue-400/30 overflow-hidden">
                <AvatarImage 
                  src="/lovable-uploads/12d1eec6-25de-486a-9bb5-74c5d247d649.png" 
                  alt="LOGAN" 
                  className="object-cover"
                  style={{ 
                    objectPosition: "center top", 
                    objectFit: "cover",
                    filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.5))"
                  }}
                />
                <AvatarFallback className="bg-blue-100 text-blue-800">LO</AvatarFallback>
              </Avatar>
              <span className="font-medium text-base">LOGAN</span>
            </div>
            <button 
              onClick={() => setIsChatOpen(false)} 
              className="text-white hover:text-gray-200 transition-colors rounded-full p-1 hover:bg-white/10"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Messages Area - Increasing height and size */}
          <div className="h-[450px] overflow-hidden py-3 px-4 flex flex-col gap-3 bg-gray-50">
            <ScrollArea className="h-full pr-2">
              <div className="flex flex-col gap-3">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`${
                      message.isUser 
                        ? "ml-auto bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md" 
                        : "mr-auto bg-white border-gray-200 text-gray-800 shadow-sm"
                    } max-w-[85%] p-3 rounded-xl border animate-fade-in text-sm ${!message.isUser ? "flex items-start gap-2" : ""}`}
                  >
                    {/* Show Logan's avatar in bot messages */}
                    {!message.isUser && (
                      <Avatar className="h-7 w-7 mt-1 border border-blue-100 overflow-hidden flex-shrink-0">
                        <AvatarImage 
                          src="/lovable-uploads/12d1eec6-25de-486a-9bb5-74c5d247d649.png" 
                          alt="LOGAN" 
                          className="object-cover"
                          style={{ 
                            objectPosition: "center top", 
                            objectFit: "cover",
                            filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.4))"
                          }}
                        />
                        <AvatarFallback className="bg-blue-100 text-blue-800">LO</AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className="flex flex-col text-left">
                      {message.isUser ? (
                        <span className="text-sm">{message.text}</span>
                      ) : (
                        renderMessageContent(message.text)
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <div className="mr-auto bg-white border-gray-200 text-gray-800 max-w-[85%] p-3 rounded-xl border shadow-sm flex items-start gap-2">
                    <Avatar className="h-7 w-7 mt-1 border border-blue-100 overflow-hidden">
                      <AvatarImage 
                        src="/lovable-uploads/12d1eec6-25de-486a-9bb5-74c5d247d649.png" 
                        alt="LOGAN" 
                        className="object-cover"
                        style={{ 
                          objectPosition: "center top", 
                          objectFit: "cover",
                          filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.4))"
                        }}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-800">LO</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center">
                      <span className="text-gray-600 text-sm">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1 animate-[bounce_0.5s_infinite_0ms]"></span>
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1 animate-[bounce_0.5s_infinite_150ms]"></span>
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-[bounce_0.5s_infinite_300ms]"></span>
                      </span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>
          
          {/* Input Area */}
          <div className="mt-auto p-3 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            {/* Chat Input Form */}
            <form id="chat-form" onSubmit={handleSendMessage} className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your question here..."
                  className="w-full pr-12 bg-white/80 backdrop-blur-sm border-blue-200 text-gray-800 rounded-full focus:ring-2 focus:ring-blue-400 shadow-inner hover:shadow-md transition-all duration-300 text-sm py-2"
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  <SendHorizontal size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
