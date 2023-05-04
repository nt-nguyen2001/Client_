export function mailRegister(account: string) {
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      account,
    }),
  });
}
