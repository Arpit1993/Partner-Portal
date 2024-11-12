export type ApiError = {
  response?: {
    status: number;
  };
  request?: {
    status: number;
  };
};

export type AuthClientInput = {
  successCB?: () => Promise<Record<string, unknown>>;
  errorCB?: (err?: Record<string, unknown>) => void;
};

export type ApiResponse<T> = {
  data: T;
  status?: number;
};
