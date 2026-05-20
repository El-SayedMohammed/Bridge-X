const BASE_URL = "";

export function getToken() {
  return localStorage.getItem("auth_token") || "";
}

export function saveToken(token) {
  localStorage.setItem("auth_token", token);
}

export function removeToken() {
  localStorage.removeItem("auth_token");
}

async function request(method, endpoint, body = null, useToken = false) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true"
  };

  if (useToken) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const config = { method, headers };

  if (body && method !== "GET") {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  
  let data;
  try {
    const text = await response.text();
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = { message: "Server returned invalid JSON (HTML Error Page)" };
  }

  if (!response.ok) {
    const error = new Error(data.message || "Something went wrong");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

async function multipartRequest(endpoint, formData) {
  const headers = {
    Accept: "application/json",
    "ngrok-skip-browser-warning": "true"
  };

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Something went wrong");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function registerUser({ fullName, email, password, passwordConfirmation }) {
  const data = await request("POST", "/api/company/auth/register", {
    full_name: fullName,
    email,
    password,
    password_confirmation: passwordConfirmation,
  });

  const token =
    data.token ||
    data.access_token ||
    data.data?.token ||
    data.data?.access_token;

  if (token) {
    saveToken(token);
  }

  return data;
}

export async function verifyEmail({ email, code }) {
  return request("POST", "/api/register/verify", { email, code });
}

export async function loginUser({ email, password }) {
  const data = await request("POST", "/api/company/auth/login", { email, password });

  const token =
    data.token ||
    data.access_token ||
    data.data?.token ||
    data.data?.access_token;

  if (token) {
    saveToken(token);
  }

  return data;
}

export async function getSocialLoginUrl(provider) {
  return request("GET", `/api/company/auth/${provider}/redirect`);
}

export async function changePassword({ oldPassword, password, passwordConfirmation }) {
  return request("POST", "/api/company/auth/change-password", {
    old_password: oldPassword,
    password,
    password_confirmation: passwordConfirmation,
  }, true);
}

export async function logoutUser() {
  const data = await request("POST", "/api/company/auth/logout", null, true);
  removeToken();
  return data;
}

export async function forgotPassword({ email }) {
  return request("POST", "/api/forgot-password", { email });
}

export async function verifyResetCode({ email, code }) {
  return request("POST", "/api/reset-password/verify", { email, code });
}

export async function resetPassword({ resetToken, email, password, passwordConfirmation }) {
  return request("POST", "/api/reset-password", {
    reset_token: resetToken,
    email,
    password,
    password_confirmation: passwordConfirmation,
  });
}

export async function resendVerification({ email }) {
  return request("POST", "/api/register/resend-code", { email });
}

export async function completeCompanyProfile({
  userId, companyName, phone, about, country, location, crNumber, industry, links, logo,
}) {
  const formData = new FormData();

  if (userId) formData.append("user_id", userId);

  if (companyName) formData.append("company_name", companyName);
  if (phone) formData.append("phone", phone);
  if (about) formData.append("about", about);
  if (country) formData.append("country", country);
  if (location) formData.append("location", location);
  if (crNumber) formData.append("cr_number", crNumber);
  if (industry) formData.append("industry", industry);

  if (links && links.length > 0) {
    links.forEach((link, index) => {
      if (link.trim()) {
        formData.append(`social_links[${index}]`, link);
      }
    });
  }

  if (logo) {
    formData.append("logo", logo);
  }

  return multipartRequest("/api/company/profile/complete", formData);
}

export async function getCompanyProfile() {
  return request("GET", "/api/company/profile/me", null, true);
}

export async function updateCompanyProfile({
  companyName, phone, about, country, location, crNumber, industry, links, logo,
}) {
  const formData = new FormData();

  if (companyName) formData.append("company_name", companyName);
  if (phone) formData.append("phone", phone);
  if (about) formData.append("about", about);
  if (country) formData.append("country", country);
  if (location) formData.append("location", location);
  if (crNumber) formData.append("cr_number", crNumber);
  if (industry) formData.append("industry", industry);

  if (links && links.length > 0) {
    links.forEach((link, index) => {
      if (link.trim()) {
        formData.append(`social_links[${index}]`, link);
      }
    });
  }

  if (logo) {
    formData.append("logo", logo);
  }

  return multipartRequest("/api/company/profile/update", formData);
}

export async function deleteCompanyAccount() {
  return request("DELETE", "/api/company/profile/delete", null, true);
}

export async function getProgrammers({ page = 1, track, skill, stars, experienceLevel } = {}) {
  const params = new URLSearchParams();
  params.append("page", page);
  if (track) params.append("filter[track]", track);
  if (skill) params.append("filter[skills.name]", skill);
  if (stars) params.append("filter[stars]", stars);
  if (experienceLevel) params.append("filter[experience_level]", experienceLevel);

  const url = `/api/programmer/list?${params.toString()}`;

  return request("GET", url, null, true);
}

export async function getProgrammerDetails(id) {
  return request("GET", `/api/programmer/${id}`, null, true);
}

export async function sendJobOffer({ title, description, salaryRange, jobType, workType, programmerId }) {
  return request("POST", "/api/job-offer/send", {
    title,
    description,
    salary_range: salaryRange,
    job_type: jobType,
    work_type: workType,
    programmer_id: programmerId,
  }, true);
}

export async function getJobOffers(page = 1) {
  return request("GET", `/api/job-offer?page=${page}`, null, true);
}
