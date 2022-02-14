import { useState, useCallback } from "react";

export const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [xTotalCount, setXTotalCount] = useState(0);

  const request = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setLoading(true);

      try {
        if (body) {
          body = JSON.stringify(body);
          headers["content-Type"] = "application/json";
        }

        const response = await fetch(
          `https://ekreative-json-server.herokuapp.com${url}`,
          { method, body, headers }
        );

        setXTotalCount(Number(response.headers.get(["X-Total-Count"])));

        const data = await response.json();

        if (!response.ok) {
          const newError = new Error(`${data}` || "Unknown error");
          newError.name = `Error status ${response.status}`;
          throw newError;
        }

        return data;
      } catch (e) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, request, xTotalCount };
};
