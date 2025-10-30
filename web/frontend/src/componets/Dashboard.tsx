import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageUpload } from './ImageUpload';
import { AnalysisResult as ResultCard, AnalysisResult as ResultType } from './AnalysisResult';
import { ChatBot } from './ChatBot';
import { LogOut, Upload, History, User } from 'lucide-react';
import { ImageWithFallback } from './more/ImageWithFallback';

interface DashboardProps {
  userEmail: string;
  onLogout: () => void;
}

export function Dashboard({ userEmail, onLogout }: DashboardProps) {
  const [currentAnalysis, setCurrentAnalysis] = useState<ResultType | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<ResultType[]>([]);
  const [activeTab, setActiveTab] = useState('upload');

  const handleImageAnalyzed = (result: ResultType) => {
    setCurrentAnalysis(result);
    setAnalysisHistory((prev) => [result, ...prev]);
    setActiveTab('result');
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-x-hidden flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1631651363531-fd29aec4cb5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Logo"
                className="w-6 h-6"
              />
            </div>
            <div>
              <h1 className="text-blue-900 font-semibold">AI Viêm Phổi</h1>
              <p className="text-gray-600 text-sm">Chẩn đoán viêm phổi thông minh</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-gray-600 text-sm">Chào mừng</p>
              <p className="text-blue-600 font-medium">{userEmail}</p>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 w-full px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload ảnh
                </TabsTrigger>
                <TabsTrigger value="result" disabled={!currentAnalysis}>
                  Kết quả
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Lịch sử
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="mt-6">
                <ImageUpload onImageAnalyzed={handleImageAnalyzed} />
              </TabsContent>

              <TabsContent value="result" className="mt-6">
                {currentAnalysis ? (
                  <ResultCard result={currentAnalysis} />
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <p className="text-gray-500">Chưa có kết quả phân tích nào.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Lịch sử phân tích</CardTitle>
                    <CardDescription>Các lần phân tích trước đây</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysisHistory.map((r, i) => (
                        <div
                          key={i}
                          className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            setCurrentAnalysis(r);
                            setActiveTab('result');
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                r.label !== 'NORMAL' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {r.label === 'NORMAL'
                                ? 'Bình thường'
                                : r.label === 'BACTERIAL'
                                ? 'Nghi ngờ viêm phổi (vi khuẩn)'
                                : 'Nghi ngờ viêm phổi (virus)'}
                            </span>
                            <span className="text-gray-500 text-sm">
                              {r.timestamp.toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">
                            Độ tin cậy: {Math.round((r.topConfidence || 0) * 100)}%
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right */}
          <div className="flex flex-col space-y-6 h-full">
            <ChatBot analysisResult={currentAnalysis as any} />

            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Thông tin nhanh
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="text-blue-800 mb-1">Khi nào cần đi khám?</h4>
                  <p className="text-blue-700">Sốt cao, ho dai dẳng, khó thở, đau ngực</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="text-green-800 mb-1">Phòng ngừa</h4>
                  <p className="text-green-700">Rửa tay, tiêm vắc-xin, tránh hút thuốc</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <h4 className="text-orange-800 mb-1">Lưu ý</h4>
                  <p className="text-orange-700">AI chỉ hỗ trợ tham khảo, không thay thế bác sĩ</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
