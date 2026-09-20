import "../styles/loadingScreen.css";

interface LoadingScreenProps {
  logoUrl: string;
  progress?: number;
}

export default function LoadingScreen({
  logoUrl,
  progress = 100,
}: LoadingScreenProps) {
  const clampedProgress = Math.max(0, Math.min(progress, 100));

  return (
    <main className="loading-screen">
      <div className="loading-content">
        <img
          src={logoUrl}
          alt="Relaxit"
          className="loading-logo"
        />

        <div className="loading-line">
          <div className="loading-line-inner" style={{ width: `${clampedProgress}%` }}></div>
        </div>


        <p className="loading-text">
          Preparing your experience
        </p>
      </div>
    </main>
  );
}