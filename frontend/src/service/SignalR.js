import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://192.168.1.145:7247/notificationHub")
    .withAutomaticReconnect()
    .build();

export default connection;

