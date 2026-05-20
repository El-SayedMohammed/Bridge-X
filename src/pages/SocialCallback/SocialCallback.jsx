import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveToken } from "../../services/api";

function SocialCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    // Depending on what your backend sends (e.g., ?token=123&is_new=true)
    const isNewUser = searchParams.get("is_new") === "true" || searchParams.get("isNew") === "true" || searchParams.get("is_new_user") === "true";

    if (token) {
      saveToken(token);
      

      if (isNewUser) {
        navigate("/company-register", { replace: true });
      } else {
       
        navigate("/dashboard", { replace: true });
      }
    } else {
  
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#F8FAFC" }}>
      <h2 style={{ color: "#09468C", fontFamily: "Inter, sans-serif" }}>Completing authentication...</h2>
    </div>
  );
}

export default SocialCallback;
