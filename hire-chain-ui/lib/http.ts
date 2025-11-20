import axios from "axios";

// const baseUrl = "https://hirechain-backend.onrender.com";
const baseUrl = "http://localhost:3500";

function resolveUrl(
  url: string,
  endpoint: string,
  searchParams?: URLSearchParams
) {
  const isLovable = window?.location?.href?.includes("lovable");
  const params = searchParams ? "?" + searchParams.toString() : "";
  return isLovable
    ? `${url}${endpoint.replace("/api", "")}${params}`
    : `${endpoint}${params}`;
}

// ✅ Define proper types for options
interface GetOptions {
  params?: Record<string, string | number>;
  errorMessage?: string;
}

interface PostOptions {
  errorMessage?: string;
}

interface PatchOptions {
  errorMessage?: string;
}

interface DeleteOptions {
  params?: Record<string, string | number>;
  errorMessage?: string;
}

// ✅ Define API response type
interface APIResponse<T = any> {
  data: T | null;
  err: string | null;
}

export default class HTTP {
  static async get<T = any>(
    endpoint = "",
    options: GetOptions = {}
  ): Promise<APIResponse<T>> {
    const {
      params = {},
      errorMessage = "Unable to complete requested action"
    } = options;

    try {
      const searchParams = new URLSearchParams();

      // ✅ Now TypeScript knows params is Record<string, string | number>
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });

      const token = localStorage.getItem("token");
      const response = await axios.get<T>(
        resolveUrl(baseUrl, endpoint, searchParams),
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      return { data: response.data, err: null };
    } catch (error: any) {
      return this.handleError(error, errorMessage);
    }
  }

  static async post<T = any>(
    endpoint = "",
    data: Record<string, any> | FormData = {},
    options: PostOptions = {}
  ): Promise<APIResponse<T>> {
    const { errorMessage = "Unable to complete requested action" } = options;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post<T>(
        resolveUrl(baseUrl, endpoint),
        data,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      return { data: response.data, err: null };
    } catch (error: any) {
      return this.handleError(error, errorMessage);
    }
  }

  static async patch<T = any>(
    endpoint = "",
    data: Record<string, any> | FormData = {},
    options: PatchOptions = {}
  ): Promise<APIResponse<T>> {
    const { errorMessage = "Unable to complete requested action" } = options;

    try {
      if (data instanceof FormData) {
        data.append("_method", "PATCH");
      } else {
        data._method = "PATCH";
      }

      const token = localStorage.getItem("token");
      const response = await axios.post<T>(
        resolveUrl(baseUrl, endpoint),
        data,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      return { data: response.data, err: null };
    } catch (error: any) {
      return this.handleError(error, errorMessage);
    }
  }

  static async delete<T = any>(
    endpoint = "",
    options: DeleteOptions = {}
  ): Promise<APIResponse<T>> {
    const {
      params = {},
      errorMessage = "Unable to complete requested action"
    } = options;

    try {
      const searchParams = new URLSearchParams();

      // ✅ Use Object.entries for proper typing
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });

      const token = localStorage.getItem("token");
      const response = await axios.delete<T>(
        resolveUrl(baseUrl, endpoint, searchParams),
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      return { data: response.data, err: null };
    } catch (error: any) {
      return this.handleError(error, errorMessage);
    }
  }

  // ✅ Centralized error handler with proper typing
  private static handleError(error: any, fallbackMessage: string): APIResponse {
    console.error("API Error:", error);

    let err = fallbackMessage;
    const data = error?.response?.data;

    if (data) {
      // New format
      if (data.message) {
        err = data.message;
      }
      // Old formats
      else if (data.err) {
        err = Array.isArray(data.err) ? data.err[0] : data.err;
      } else if (data.detail) {
        err = Array.isArray(data.detail) ? data.detail[0] : data.detail;
      }
    }

    return { data: null, err: err.toString() };
  }

  // ✅ Helper to convert objects to FormData
  static toFormData(data: Record<string, any> = {}): FormData {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    return formData;
  }
}
