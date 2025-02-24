import { Request, Response } from 'express';
import { luhnCheck } from "../utils/luhn";

// دالة لتوليد OTP عشوائي مكون من رقمين
const generateOTP = (): string => {
  return Math.floor(10 + Math.random() * 90).toString(); // يولد OTP مكون من رقمين
};

// دالة للتحقق من رقم الهوية وإرجاع OTP في حالة النجاح أو رسالة خطأ في حالة الفشل
export const checkId = (req: Request, res: Response) => {
  const { idNumber } = req.body;

  // التحقق من رقم الهوية باستخدام خوارزمية Luhn
  if (luhnCheck(idNumber)) {
    // إذا كان الرقم صحيحًا، توليد OTP
    const otp = generateOTP(); 

    // إرسال رقم الهوية مع OTP في حالة النجاح
    res.status(200).json({
      message: 'رقم الهوية صحيح.',
      idNumber,
      otp  // إرسال OTP مع رقم الهوية
    });
  } else {
    // إذا كان الرقم غير صحيح، إرسال رسالة خطأ
    res.status(400).json({
      message: 'رقم الهوية غير صحيح.',
      idNumber // إرسال رقم الهوية المرسل مع رسالة خطأ
    });
  }
};
