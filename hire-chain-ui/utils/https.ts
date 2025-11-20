import axios, { AxiosError } from "axios";

// Generic API result type
type ApiResult<T> = { data: T | null; err: string | null };

/**
 * POST request (supports both JSON and FormData).
 */
export async function Post<T = any>(
  url: string,
  payload: Record<string, unknown> | FormData,
  state?: (loading: boolean) => void
): Promise<ApiResult<T>> {
  try {
    if (state) state(true);

    const isFormData = payload instanceof FormData;

    const { data } = await axios.post(url, payload, {
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        token: localStorage.getItem("token") || "",
        iToken: localStorage.getItem("iToken") || "",
      },
    });

    if (data && !("err" in data)) {
      return { data, err: null };
    } else {
      return { data: null, err: data.err };
    }
  } catch (error) {
    console.error(error);
    if (error instanceof AxiosError) {
      if (error.response && error.response.data?.err) {
        return { data: null, err: error.response.data.err };
      }
      return { data: null, err: error.message };
    } else {
      return { data: null, err: "Something went wrong" };
    }
  } finally {
    if (state) state(false);
  }
}

/**
 * GET request
 */
export async function Get<T = any>(
  url: string,
  state?: (loading: boolean) => void
): Promise<ApiResult<T>> {
  try {
    if (state) state(true);

    const { data } = await axios.get(url, {
      headers: {
        token: localStorage.getItem("token") || "",
      },
    });

    if (data && !("err" in data)) {
      return { data, err: null };
    } else {
      return { data: null, err: data.err };
    }
  } catch (error) {
    console.error(error);
    if (error instanceof AxiosError) {
      if (error.response && error.response.data?.err) {
        return { data: null, err: error.response.data.err };
      }
      return { data: null, err: error.message };
    } else {
      return { data: null, err: "Something went wrong" };
    }
  } finally {
    if (state) state(false);
  }
}

/**
 * PATCH request (supports JSON & FormData like POST)
 */
export async function Patch<T = any>(
  url: string,
  payload: Record<string, unknown> | FormData,
  state?: (loading: boolean) => void
): Promise<ApiResult<T>> {
  try {
    if (state) state(true);

    const isFormData = payload instanceof FormData;

    const { data } = await axios.patch(url, payload, {
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        token: localStorage.getItem("token") || "",
      },
    });

    if (data && !("err" in data)) {
      return { data, err: null };
    } else {
      return { data: null, err: data.err };
    }
  } catch (error) {
    console.error(error);
    if (error instanceof AxiosError) {
      if (error.response && error.response.data?.err) {
        return { data: null, err: error.response.data.err };
      }
      return { data: null, err: error.message };
    } else {
      return { data: null, err: "Something went wrong" };
    }
  } finally {
    if (state) state(false);
  }
}
