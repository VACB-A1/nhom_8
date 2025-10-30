import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react';

export type PneumoniaLabel = "NORMAL" | "BACTERIAL" | "VIRUS";

export interface AnalysisResult {
  label: PneumoniaLabel;                                  // lớp dự đoán
  topConfidence: number;                                   // max(prob)
  confidencePerClass: Record<PneumoniaLabel, number>;      // từng lớp
  image: string;                                           // dataURL ảnh gốc
  gradcam: string;                                         // dataURL Grad-CAM
  heatmap?: string;                                        // (tùy) nếu BE trả riêng, nếu không sẽ dùng gradcam
  timestamp: Date;
  recommendations: string[];
  details?: string;
}

interface AnalysisResultProps {
  result: AnalysisResult;
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  const isPneumonia = result.label !== 'NORMAL';
  const confidencePercent = Math.round((result.topConfidence || 0) * 100);

  const bars: PneumoniaLabel[] = ["NORMAL", "BACTERIAL", "VIRUS"];


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isPneumonia ? (
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
          Kết quả phân tích
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {result.timestamp.toLocaleString('vi-VN')}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Label + confidence tổng */}
        <div className="text-center space-y-2">
          <Badge variant={isPneumonia ? 'destructive' : 'default'} className="text-lg px-4 py-2">
            {result.label === 'NORMAL'
              ? 'Bình thường'
              : result.label === 'BACTERIAL'
              ? 'Nghi ngờ viêm phổi do vi khuẩn'
              : 'Nghi ngờ viêm phổi do virus'}
          </Badge>
          <div className="space-y-2">
            <p>Độ tin cậy (top-1): {confidencePercent}%</p>
            <Progress value={confidencePercent} className="w-full max-w-sm mx-auto" />
          </div>
        </div>

        {/* Thanh xác suất theo lớp */}
        <div className="space-y-3">
          {bars.map((k) => {
            const v = Math.round((result.confidencePerClass[k] || 0) * 100);
            return (
              <div key={k}>
                <div className="flex justify-between text-sm">
                  <span>{k}</span>
                  <span>{v}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded">
                  <div
                    className={`h-2 rounded ${k === result.label ? "bg-blue-600" : "bg-gray-400"}`}
                    style={{ width: `${v}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

            {/* Images: chỉ 2 ảnh (gốc & Grad-CAM) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <figure className="border rounded-lg p-2 bg-white">
            <img src={result.image} alt="Ảnh gốc" className="w-full rounded" />
            <figcaption className="text-center text-sm mt-2 text-gray-600">Ảnh gốc</figcaption>
          </figure>

          {!!result.gradcam && (
            <figure className="border rounded-lg p-2 bg-white">
              <img src={result.gradcam} alt="Grad-CAM" className="w-full rounded" />
              <figcaption className="text-center text-sm mt-2 text-gray-600">Grad-CAM Overlay</figcaption>
            </figure>
          )}
        </div>

        {/* Details */}
        {result.details && (
          <div className="space-y-2">
            <h4>Chi tiết phân tích:</h4>
            <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{result.details}</p>
          </div>
        )}

        {/* Recommendations */}
        <div className="space-y-2">
          <h4>Khuyến nghị:</h4>
          <ul className="space-y-2">
            {result.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Warning */}
        <div
          className={`border rounded-lg p-4 ${isPneumonia ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}
        >
          <p className={`${isPneumonia ? 'text-red-700' : 'text-green-700'}`}>
            {isPneumonia
              ? '🚨 Vui lòng liên hệ bác sĩ để được tư vấn và điều trị kịp thời.'
              : '✅ Kết quả cho thấy phổi bình thường, tuy nhiên vẫn nên theo dõi sức khỏe định kỳ.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
