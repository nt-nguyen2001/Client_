import { StaticImageData } from 'next/image';

export interface UserData {
  _userId: string;
  _account: string;
  _name: string;
  _userName: string;
  _phoneNumber: string;
  avatar: string;
  background_img: string;
  role: string;
  _createAt: string;
}

export interface UserPage {
  avatar: string | StaticImageData;
  background_img: string | StaticImageData;
  _name: string;
  _userId: string;
}

export interface User {
  _userId: string;
  _account: string;
  _password: string;
  _name: string;
  _userName: string;
  _phoneNumber: string;
  role: string;
  avatar: string | StaticImageData;
  background_img: string | StaticImageData;
  _createAt: string;
  //??
  public_id_img: string;
  public_id_bg: string;
}
