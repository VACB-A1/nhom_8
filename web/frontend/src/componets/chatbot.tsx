import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotProps {
  analysisResult?: {
    prediction: 'pneumonia' | 'normal';
    confidence: number;
  } | null;
}

export function ChatBot({ analysisResult }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: '1',
      content: analysisResult 
        ? `Xin chào! Tôi đã nhận được kết quả phân tích ảnh X-quang của bạn. ${
            analysisResult.prediction === 'pneumonia' 
              ? `Kết quả cho thấy nghi ngờ viêm phổi với độ tin cậy ${Math.round(analysisResult.confidence * 100)}%. ` 
              : 'Kết quả cho thấy phổi bình thường. '
          }Bạn có muốn hỏi gì về kết quả này không?`
        : 'Xin chào! Tôi là trợ lý AI chuyên về viêm phổi. Tôi có thể giúp bạn hiểu thêm về bệnh viêm phổi, triệu chứng, và cách phòng ngừa. Bạn có câu hỏi gì không?',
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [analysisResult]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('viêm phổi') || message.includes('pneumonia')) {
      return 'Viêm phổi là một bệnh nhiễm trùng gây viêm trong các túi khí của một hoặc cả hai phổi. Các triệu chứng thường gặp bao gồm ho có đờm, sốt, ớn lạnh và khó thở. Điều quan trọng là phải được chẩn đoán và điều trị sớm bởi bác sĩ.';
    }
    
    if (message.includes('triệu chứng') || message.includes('dấu hiệu')) {
      return 'Các triệu chứng chính của viêm phổi bao gồm:\n• Ho có đờm (có thể có máu)\n• Sốt, ớn lạnh\n• Khó thở hoặc thở nhanh\n• Đau ngực khi thở sâu hoặc ho\n• Mệt mỏi\n• Buồn nôn, nôn mửa hoặc tiêu chảy\n\nNếu có các triệu chứng này, hãy đến gặp bác sĩ ngay.';
    }
    
    if (message.includes('điều trị') || message.includes('chữa')) {
      return 'Điều trị viêm phổi phụ thuộc vào nguyên nhân:\n• Viêm phổi do vi khuẩn: Kháng sinh\n• Viêm phổi do virus: Thuốc kháng virus\n• Nghỉ ngơi, uống nhiều nước\n• Thuốc giảm đau, hạ sốt\n\nLưu ý: Chỉ dùng thuốc theo chỉ định của bác sĩ. Không tự ý dùng kháng sinh.';
    }
    
    if (message.includes('phòng ngừa') || message.includes('tránh')) {
      return 'Cách phòng ngừa viêm phổi:\n• Tiêm vắc-xin phòng ngừa (phế cầu khuẩn, cúm)\n• Rửa tay thường xuyên\n• Tránh hút thuốc\n• Tăng cường sức khỏe bằng ăn uống đủ chất, tập thể dục\n• Tránh tiếp xúc với người bệnh\n• Đeo khẩu trang khi cần thiết';
    }
    
    if (message.includes('kết quả') || message.includes('phân tích')) {
      if (analysisResult) {
        return analysisResult.prediction === 'pneumonia'
          ? `Kết quả phân tích cho thấy nghi ngờ viêm phổi với độ tin cậy ${Math.round(analysisResult.confidence * 100)}%. Đây chỉ là kết quả tham khảo từ AI. Tôi khuyên bạn nên đến gặp bác sĩ để được khám và chẩn đoán chính xác.`
          : 'Kết quả phân tích cho thấy phổi có vẻ bình thường. Tuy nhiên, đây chỉ là phân tích của AI. Nếu bạn có triệu chứng lo ngại, vẫn nên tham khảo ý kiến bác sĩ.';
      } else {
        return 'Bạn chưa upload ảnh X-quang nào để phân tích. Hãy upload ảnh trước để tôi có thể tư vấn về kết quả cụ thể.';
      }
    }
    
    if (message.includes('bác sĩ') || message.includes('khám')) {
      return 'Tôi khuyên bạn nên đến gặp bác sĩ chuyên khoa Hô hấp hoặc Nội khoa để được khám và tư vấn chính xác. AI chỉ có thể hỗ trợ tham khảo, không thể thay thế chẩn đoán y khoa chuyên nghiệp.';
    }
    
    return 'Cảm ơn câu hỏi của bạn. Tôi có thể giúp bạn tìm hiểu về viêm phổi, triệu chứng, điều trị và phòng ngừa. Bạn có thể hỏi tôi về những chủ đề này. Tuy nhiên, để có chẩn đoán chính xác, bạn vẫn nên tham khảo ý kiến bác sĩ.';
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="w-full h-[500px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-500" />
          Tư vấn AI về Viêm phổi
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea ref={scrollRef} className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'bot' && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-100">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[80%] p-3 rounded-lg whitespace-pre-line ${
                    message.sender === 'user'
                      ? 'bg-blue-100 text-blue-900'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.content}
                </div>
                
                {message.sender === 'user' && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gray-100">
                      <User className="w-4 h-4 text-gray-600" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-100">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="flex gap-2">
         <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Hỏi tôi về viêm phổi..."
          disabled={isTyping}
          className="bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 rounded-xl shadow-sm"
           />
          <Button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
