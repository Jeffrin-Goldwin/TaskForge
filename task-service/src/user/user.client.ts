import axios from 'axios';

export async function getUserProfile(userServiceUrl: string, authHeader: string) {
  const res = await axios.get(
    `${userServiceUrl}/users/me`,
    { headers: { Authorization: authHeader } },
  );

  return res.data;
}
