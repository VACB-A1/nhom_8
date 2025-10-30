/* import { useState } from "react"; */

import { Dashboard } from "./components/Dashboard";

export default function App() {
 /* const [user, setUser] = useState<string | null>(null);

/*  const handleLogin = (email: string) => setUser(email);
/*  const handleLogout = () => setUser(null);*/

  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="min-h-screen w-full flex">
        {/* 
        {!user ? (
          <AuthPage onLogin={handleLogin} />
        ) : (
          <Dashboard userEmail={user!} onLogout={handleLogout} />
        )}
        */}

        {/*  Bỏ qua login, vào thẳng Dashboard */}
        <Dashboard userEmail="VACB" onLogout={() => {}} />
      </div>
    </div>
  );
}
