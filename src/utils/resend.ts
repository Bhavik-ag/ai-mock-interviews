"use server";
import { Resend } from "resend";

export const sendMail = async (payload: any) => {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    console.log(payload, "payload");
    const resend = new Resend(apiKey);
    const response = await resend.emails.send({
      from: "Team Fleqo <no-reply@fleqo.com>",
      ...payload,
    });

    if (response?.data) return true;
    return false;
  } catch (error) {
    return false;
  }
};
