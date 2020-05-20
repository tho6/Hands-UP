export interface IUserQ{
userId?:number|null;
name:string;
isHost?:boolean;
}
export interface IGuest{
guestId?:number;
name:string;
}
export interface GuestInformation {
    token: string | null
    user: (IUserQ & IGuest) | null,
}