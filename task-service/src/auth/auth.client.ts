import axios from 'axios';

export async function validateToken(authUrl: string, authHeader: string) {
  const res = await axios.post(
    `${authUrl}/auth/validate`,
    {},
    { headers: { Authorization: authHeader } },
  );

  return res.data;
}
