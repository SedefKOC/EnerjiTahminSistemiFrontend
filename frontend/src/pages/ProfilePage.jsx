import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/ProfilePage.css";

function ProfilePage() {
  const storedUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

  const [user, setUser] = useState(storedUser);
  const [modalType, setModalType] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/users/${storedUser.userId}`,
        );
        const data = await res.json();
        setUser(data);
        setNewUsername(data.username || "");
      } catch (err) {
        console.error("Profil alınamadı:", err);
      }
    };

    fetchUser();
  }, [storedUser.userId]);

  const refreshUser = async () => {
    const res = await fetch(
      `http://localhost:8080/api/users/${storedUser.userId}`,
    );
    const data = await res.json();
    setUser(data);

    const updatedLocalUser = {
      ...storedUser,
      username: data.username,
      email: data.email,
      phone: data.phone,
      region: data.region,
      facility: data.facility,
    };

    localStorage.setItem("loggedInUser", JSON.stringify(updatedLocalUser));
  };

  const handleSaveUsername = async () => {
    try {
      const payload = {
        username: newUsername,
        password: "",
        email: user.email || "",
        phone: user.phone || "",
      };

      const res = await fetch(
        `http://localhost:8080/api/users/${storedUser.userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        throw new Error("Kullanıcı adı güncelleme isteği başarısız");
      }

      await refreshUser();
      setModalType(null);
      alert("Kullanıcı adı güncellendi 🎉");
    } catch (err) {
      console.error("Kullanıcı adı güncellenemedi:", err);
      alert("Kullanıcı adı güncellenemedi");
    }
  };

  const handleSavePassword = async () => {
    try {
      const payload = {
        username: user.username,
        password: newPassword,
        email: user.email || "",
        phone: user.phone || "",
      };

      const res = await fetch(
        `http://localhost:8080/api/users/${storedUser.userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        throw new Error("Şifre güncelleme isteği başarısız");
      }

      await refreshUser();
      setNewPassword("");
      setModalType(null);
      alert("Şifre güncellendi 🎉");
    } catch (err) {
      console.error("Şifre güncellenemedi:", err);
      alert("Şifre güncellenemedi");
    }
  };
  return (
    <DashboardLayout pageTitle="Profil">
      <div className="profile-page">
        <div className="profile-card">
          <h2>Kullanıcı Bilgileri</h2>
          <p className="profile-subtitle">
            Profil bilgilerinizi görüntüleyebilir, kullanıcı adı ve şifrenizi
            güncelleyebilirsiniz.
          </p>

          <div className="profile-info-list">
            <div className="profile-info-row">
              <span>Ad Soyad</span>
              <strong>
                {user.firstName} {user.lastName}
              </strong>
            </div>

            <div className="profile-info-row">
              <span>Kullanıcı Adı</span>
              <div className="profile-action-area">
                <strong>{user.username}</strong>
                <button onClick={() => setModalType("username")}>
                  Değiştir
                </button>
              </div>
            </div>

            <div className="profile-info-row">
              <span>Şifre</span>
              <div className="profile-action-area">
                <strong>••••••••</strong>
                <button onClick={() => setModalType("password")}>
                  Değiştir
                </button>
              </div>
            </div>

            <div className="profile-info-row">
              <span>E-posta</span>
              <strong>{user.email || "-"}</strong>
            </div>

            <div className="profile-info-row">
              <span>Telefon</span>
              <strong>{user.phone || "-"}</strong>
            </div>

            <div className="profile-info-row">
              <span>Rol</span>
              <strong>{user.role}</strong>
            </div>

            <div className="profile-info-row">
              <span>Tesis Tipi</span>
              <strong>{user.plantType}</strong>
            </div>

            <div className="profile-info-row">
              <span>Bölge</span>
              <strong>{user.region?.name || "-"}</strong>
            </div>

            <div className="profile-info-row">
              <span>Tesis</span>
              <strong>{user.facility?.name || "-"}</strong>
            </div>
          </div>
        </div>
      </div>

      {modalType === "username" && (
        <div
          className="profile-modal-overlay"
          onClick={() => setModalType(null)}
        >
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Kullanıcı Adını Değiştir</h3>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Yeni kullanıcı adı"
            />
            <div className="profile-modal-actions">
              <button
                className="secondary-btn"
                onClick={() => setModalType(null)}
              >
                Vazgeç
              </button>
              <button className="primary-btn" onClick={handleSaveUsername}>
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {modalType === "password" && (
        <div
          className="profile-modal-overlay"
          onClick={() => setModalType(null)}
        >
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Şifreyi Değiştir</h3>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Yeni şifre"
            />
            <div className="profile-modal-actions">
              <button
                className="secondary-btn"
                onClick={() => setModalType(null)}
              >
                Vazgeç
              </button>
              <button className="primary-btn" onClick={handleSavePassword}>
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default ProfilePage;
