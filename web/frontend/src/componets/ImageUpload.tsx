import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './more/ImageWithFallback';
import { Upload, X, FileImage } from 'lucide-react';
import type { AnalysisResult, PneumoniaLabel } from './AnalysisResult';



const API_BASE = import.meta.env.VITE_API_BASE as string;

interface ImageUploadProps {
  onImageAnalyzed: (result: AnalysisResult) => void;
}

export function ImageUpload({ onImageAnalyzed }: ImageUploadProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) setUploadedImage(e.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  };

  const analyzeImage = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);
    try {
      const form = new FormData();
      form.append('file', uploadedFile); // key phải là 'file' đúng như backend

      const res = await fetch(`${API_BASE}/predict/file`, {
        method: 'POST',
        body: form,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || `HTTP ${res.status}`);
      }
      const data = await res.json();

    // ==== 1) Chuẩn hóa LABEL & flags ====
const finalLabel = String(data.label ?? '').trim().toUpperCase();      // NORMAL | BACTERIAL | VIRUS
const label = (finalLabel === 'VIRAL' ? 'VIRUS' : finalLabel) as 'NORMAL' | 'BACTERIAL' | 'VIRUS';

const isNormal    = label === 'NORMAL';
const isBacterial = label === 'BACTERIAL';
const isVirus     = label === 'VIRUS';

// ==== 2) Xác suất theo lớp ====
const confMap = (data.confidence_per_class || data.probs || {}) as Record<string, number>;
const confidencePerClass = {
  NORMAL: Number(confMap.NORMAL || 0),
  BACTERIAL: Number(confMap.BACTERIAL || 0),
  VIRUS: Number((confMap.VIRUS ?? confMap.VIRAL) || 0),
};
const topConfidence = typeof data.top_confidence === 'number'
  ? Number(data.top_confidence)
  : Math.max(...Object.values(confidencePerClass));

// ==== 3) Ảnh ====
const image   = uploadedImage || (data.image_base64 ? `data:image/jpeg;base64,${data.image_base64}` : '');
const gradcam = data.gradcam_base64 ? `data:image/jpeg;base64,${data.gradcam_base64}` : '';

// ==== 4) Lấy details/recs từ BE (root hoặc advice.*), nếu trống thì fallback theo lớp ====
let beDetails = '';
let beRecs: string[] = [];

if (typeof data.details === 'string') beDetails = data.details.trim();
if (Array.isArray(data.recommendations)) beRecs = data.recommendations;

if (!beDetails && data.advice && typeof data.advice.details === 'string') {
  beDetails = data.advice.details.trim();
}
if (beRecs.length === 0 && data.advice && Array.isArray(data.advice.recommendations)) {
  beRecs = data.advice.recommendations;
}

let details = beDetails;
if (!details) {
  if (label === 'NORMAL') {
    details = 'Mô hình không thấy dấu hiệu viêm phổi rõ rệt trên ảnh.';
  } else if (label === 'BACTERIAL') {
    details = 'Gợi ý viêm phổi do vi khuẩn: tổn thương có thể khu trú/đông đặc rõ, biên sắc nét hơn.';
  } else if (label === 'VIRUS') {
    details = 'Gợi ý viêm phổi do virus: pattern mờ lan tỏa/kính mờ, có thể hai bên; tổn thương thường không khu trú.';
  }
}

let recommendations = beRecs;
if (recommendations.length === 0) {
  if (label === 'NORMAL') {
    recommendations = [
      'Tiếp tục theo dõi triệu chứng (ho, sốt, khó thở).',
      'Khám sức khỏe định kỳ theo khuyến cáo.',
    ];
  } else if (label === 'BACTERIAL') {
    recommendations = [
      'Khám bác sĩ sớm để đánh giá và cân nhắc kháng sinh.',
      'Có thể làm công thức máu/CRP theo chỉ định.',
      'Uống đủ nước; theo dõi sốt và hô hấp.',
    ];
  } else if (label === 'VIRUS') {
    recommendations = [
      'Tham vấn bác sĩ; thường ưu tiên điều trị triệu chứng và theo dõi.',
      'Cân nhắc test virus hô hấp (Influenza/RSV/SARS-CoV-2) theo chỉ định.',
      'Nghỉ ngơi, bù nước; theo dõi SpO₂ và dấu hiệu nặng.',
    ];
  }
}

console.log({ finalLabel, label, isNormal, isBacterial, isVirus, beDetails, beRecs });

// ==== 5) Đóng gói trả Dashboard ====
const result: AnalysisResult = {
  label,
  topConfidence,
  confidencePerClass,
  image,
  gradcam,
  timestamp: new Date(),
  recommendations,
  details,
};

onImageAnalyzed(result);

    } catch (e: any) {
      alert(`Lỗi phân tích: ${e.message || e}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileImage className="w-5 h-5" />
          Upload ảnh X-quang ngực
        </CardTitle>
        <CardDescription>Tải lên ảnh X-quang ngực để phân tích. Hỗ trợ JPG, PNG.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!uploadedImage ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="mb-2">Kéo thả ảnh vào đây hoặc</p>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              Chọn file
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <p className="text-gray-500 mt-2">Kích thước tối đa: 10MB</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <ImageWithFallback
                src={uploadedImage}
                alt="Uploaded X-ray"
                className="w-full max-w-md mx-auto rounded-lg border"
              />
              <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={removeImage}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-center">
              <Button onClick={analyzeImage} disabled={isAnalyzing} className="w-full max-w-sm">
                {isAnalyzing ? 'Đang phân tích...' : 'Phân tích ảnh'}
              </Button>
            </div>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-yellow-800 mb-2">⚠️ Lưu ý quan trọng</h4>
          <p className="text-yellow-700">
            Kết quả AI chỉ mang tính chất tham khảo. Vui lòng hỏi bác sĩ để có chẩn đoán chính xác.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
