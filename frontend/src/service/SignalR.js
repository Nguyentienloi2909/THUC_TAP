import * as signalR from "@microsoft/signalr";

// Kết nối đến notificationHub
const notificationConnection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:7247/notificationHub")
    // .withUrl("http://192.168.1.145:7247/notificationHub") 
    .withAutomaticReconnect()
    .build();

// Kết nối đến chatHub
const chatConnection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:7247/chatHub")
    // .withUrl("http://192.168.1.145:7247/chatHub") 
    .withAutomaticReconnect()
    .build();

export { notificationConnection, chatConnection };