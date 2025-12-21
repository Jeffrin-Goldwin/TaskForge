import axios from 'axios';

export async function validateToken(
  authServiceUrl: string,
  authHeader: string,
) {
  if (!authHeader) {
    throw new Error('Missing Authorization header');
  }

  const response = await axios.post(
    `${authServiceUrl}/auth/validate`,
    {},
    {
      headers: {
        Authorization: authHeader,
      },
    },
  );

  return response.data;
}
