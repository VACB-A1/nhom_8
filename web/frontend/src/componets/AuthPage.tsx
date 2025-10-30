import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { ImageWithFallback } from "./more/ImageWithFallback";

interface AuthPageProps {
  onLogin: (email: string) => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLogin(loginForm.email);
    }, 1000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      alert("Mật khẩu không khớp");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(registerForm.email);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left side - Giới thiệu */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1682706841478-88eb8995357b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800"
            alt="Medical professional"
            className="rounded-xl shadow-xl w-full max-w-md"
          />
          <h1 className="text-3xl font-bold text-blue-900">
            Hệ thống Chẩn đoán Viêm phổi AI
          </h1>
          <p className="text-gray-700 leading-relaxed max-w-md">
            Ứng dụng trí tuệ nhân tạo giúp phân tích ảnh X-quang phổi nhanh
            chóng và chính xác. Cung cấp kết quả và tư vấn tức thì.
          </p>

          <div className="bg-white/80 backdrop-blur-sm border border-blue-100 p-5 rounded-lg shadow-md max-w-md">
            <h3 className="text-blue-800 font-semibold mb-2">
              💡 Tính năng nổi bật:
            </h3>
            <ul className="text-blue-700 space-y-1 text-left">
              <li>• Phân tích ảnh X-quang tự động</li>
              <li>• Chat tư vấn với AI</li>
              <li>• Báo cáo chi tiết và khuyến nghị</li>
              <li>• Lưu trữ lịch sử phân tích</li>
            </ul>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-xl border-blue-100">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-blue-900 font-bold">
                Chào mừng đến với PneumoniaAI
              </CardTitle>
              <CardDescription className="text-gray-600">
                Đăng nhập hoặc tạo tài khoản để bắt đầu
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="login">Đăng nhập</TabsTrigger>
                  <TabsTrigger value="register">Đăng ký</TabsTrigger>
                </TabsList>

                {/* ---- Đăng nhập ---- */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        value={loginForm.email}
                        onChange={(e) =>
                          setLoginForm({ ...loginForm, email: e.target.value })
                        }
                        className="bg-white border-gray-300 text-gray-900"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Mật khẩu</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginForm.password}
                        onChange={(e) =>
                          setLoginForm({
                            ...loginForm,
                            password: e.target.value,
                          })
                        }
                        className="bg-white border-gray-300 text-gray-900"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </Button>
                  </form>
                </TabsContent>

                {/* ---- Đăng ký ---- */}
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Họ và tên</Label>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Your Name"
                        value={registerForm.fullName}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            fullName: e.target.value,
                          })
                        }
                        className="bg-white border-gray-300 text-gray-900"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your@email.com"
                        value={registerForm.email}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            email: e.target.value,
                          })
                        }
                        className="bg-white border-gray-300 text-gray-900"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Mật khẩu</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerForm.password}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            password: e.target.value,
                          })
                        }
                        className="bg-white border-gray-300 text-gray-900"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-confirm">Xác nhận mật khẩu</Label>
                      <Input
                        id="register-confirm"
                        type="password"
                        placeholder="••••••••"
                        value={registerForm.confirmPassword}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="bg-white border-gray-300 text-gray-900"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "Đang tạo tài khoản..." : "Đăng ký"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
