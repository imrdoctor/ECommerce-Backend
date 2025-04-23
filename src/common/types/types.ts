import { Types } from "mongoose";

export enum UserRoles {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum UserGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
export enum OtpTypes{
    confirmEmail = "confirmEmail",
    confirmPhone = "confirmPhone",
    forgetPassword = "forgetPassword",
}
export enum LoginProvider{
    google = "google",
    email = "email",
}
export enum PaymentMethods{
    cash = "cash",
    card = "card",
}
export enum PaymentStatus {
  Unpaid = "unpaid",
  Paid = "paid",
  Refunded = "refunded",
  Failed = "failed",
}
export enum OrderStatus {
  Pending = "pending", 
  Confirmed = "confirmed",
  Cancled = "Cancled"           
}
export interface CartPopulated {
  Products: {
    productId: {
      _id: Types.ObjectId;
      ProductName: string;
      SubPrice: number;
      Quantity: number;
      Img?: { secure_url: string; public_id?: string }; 
    };
    quantity: number;
    finalPrice: number;
  }[];
}
