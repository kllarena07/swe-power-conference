type SendPushNotifProps = {
  subject: string;
  message: string;
  accessToken: string | undefined;
};

export const sendPushNotification = async ({
  subject,
  message,
  accessToken,
}: SendPushNotifProps): Promise<Response> => {
  const data = {
    subject,
    message,
  };

  return fetch(
    "https://ffzljrapzzjpcjsfupeh.supabase.co/functions/v1/send-notif",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );
};
