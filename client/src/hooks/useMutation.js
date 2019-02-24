import { useMutation as useHookMutation } from "react-apollo-hooks";

export const useMutation = (
  mutation,
  { onCompleted, onError, ...options } = {}
) => {
  const mutate = useHookMutation(mutation, options);

  const handler = async (...args) => {
    try {
      const { data } = await mutate(...args);

      if (onCompleted) {
        onCompleted(data);
      }

      return { data };
    } catch (e) {
      if (onError) {
        onError(e);
      } else {
        throw e;
      }
    }
  };

  return handler;
};
