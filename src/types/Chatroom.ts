export interface Chatroom {
  id: number;
  name: string;
  is_group: boolean;
  members: Member[];
  last_message: LastMessage;
  unread_count: number;
}

export interface Member {
  id: number;
  username: string;
  pfp_url: string;
  role: string;
}

export interface LastMessage {
  id: number;
  chat: number;
  sender: string;
  content: string;
  timestamp: string;
}
// {
//     "id": 3,
//     "name": "test1's ChatRoom 3",
//     "is_group": true,
//     "members": [
//         {
//             "id": 1,
//             "username": "test1",
//             "pfp_url": "https://storage.googleapis.com/sfy-firebase.appspot.com/profile_pictures/defaultuser.png",
//             "role": "owner"
//         },
//         {
//             "id": 2,
//             "username": "test2",
//             "pfp_url": "https://storage.googleapis.com/sfy-firebase.appspot.com/profile_pictures/defaultuser.png",
//             "role": "member"
//         },
//         {
//             "id": 3,
//             "username": "test3",
//             "pfp_url": "https://storage.googleapis.com/sfy-firebase.appspot.com/profile_pictures/defaultuser.png",
//             "role": "member"
//         }
//     ],
//     "last_message": {
//         "id": 18,
//         "chat": 3,
//         "sender": "test1",
//         "content": "Hi\nMy name is gustavo",
//         "timestamp": "2025-05-10T12:33:32.868979Z"
//     },
//     "unread_count": 3
// }
