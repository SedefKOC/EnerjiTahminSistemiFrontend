import { useMemo } from 'react';
import '../styles/LoginPage.css';

function LoginPage() {
  const selectedPlantType = useMemo(
    () => localStorage.getItem('selectedPlantType') || 'GES',
    []
  );

  return (
    <div className={`login-page ${selectedPlantType === 'GES' ? 'ges-theme' : 'hes-theme'}`}>
      <div className="login-box">
        <p className="login-badge">{selectedPlantType} seçildi</p>
        <h1>Login Ekranı</h1>
        <p>
          Burada bir sonraki adımda rapordaki role dayalı giriş ekranını
          yerleştireceğiz.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;